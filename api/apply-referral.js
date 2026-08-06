// api/apply-referral.js
//
// Actually grants the "7 days Pro free" that the Refer a Friend card
// promises. Previously nothing did this — a new signup arriving via a
// referral link just had `referred_by` saved on their profile and got a
// toast promising free days "soon," which never actually happened.
//
// Called once, right after a new user finishes signing up (or first opens
// the app) with a `?ref=CODE` in the URL. Runs entirely server-side using
// the service-role key, same as /api/verify-payment, so a user can't just
// call this repeatedly from dev tools to keep resetting their own trial.
//
// Rules:
//   - The new signup always gets a 7-day Pro trial (unless they're already
//     Pro somehow, in which case there's nothing to add).
//   - The referrer only gets a 7-day Pro trial if they are NOT already Pro.
//     Someone who already has Pro (e.g. Lifetime) has nothing to gain from
//     more Pro, so nothing is changed on their account.
//   - Self-referrals and repeat calls for the same user are no-ops.
//
// Required environment variables (already set for /api/verify-payment):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const TRIAL_DAYS = 7;

async function sbFetch(path, opts = {}) {
  const resp = await fetch(SUPABASE_URL + path, {
    ...opts,
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_SERVICE_ROLE_KEY,
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  return resp;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { referralCode } = req.body || {};

    // 1. Identify the calling (new) user from their session token.
    const authHeader = req.headers.authorization || '';
    const accessToken = authHeader.replace(/^Bearer\s+/i, '');
    if (!accessToken) {
      res.status(401).json({ error: 'Not signed in' });
      return;
    }
    const userResp = await fetch(SUPABASE_URL + '/auth/v1/user', {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + accessToken },
    });
    if (!userResp.ok) {
      res.status(401).json({ error: 'Invalid session' });
      return;
    }
    const newUser = await userResp.json();
    if (!newUser || !newUser.id) {
      res.status(401).json({ error: 'Invalid session' });
      return;
    }

    // 2. Load the new user's own profile — bail out if already processed
    //    (prevents replaying this endpoint to keep resetting the trial).
    const selfResp = await sbFetch(
      '/rest/v1/profiles?id=eq.' + encodeURIComponent(newUser.id) + '&select=id,is_pro,referral_processed'
    );
    const selfRows = await selfResp.json();
    const self = Array.isArray(selfRows) ? selfRows[0] : null;

    if (self && self.referral_processed) {
      res.status(200).json({ success: true, alreadyProcessed: true });
      return;
    }

    if (!referralCode || typeof referralCode !== 'string') {
      // No referral to apply — just mark processed so this is a one-shot check.
      await sbFetch('/rest/v1/profiles', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify({ id: newUser.id, referral_processed: true }),
      });
      res.status(200).json({ success: true, granted: false });
      return;
    }

    // 3. Find the referrer by their stored code.
    const referrerResp = await sbFetch(
      '/rest/v1/profiles?referral_code=eq.' + encodeURIComponent(referralCode) + '&select=id,is_pro'
    );
    const referrerRows = await referrerResp.json();
    const referrer = Array.isArray(referrerRows) ? referrerRows[0] : null;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString();

    // Self-referral guard.
    const validReferrer = referrer && referrer.id !== newUser.id;

    // 4. Grant the new user a trial, unless they're already Pro somehow.
    const newUserAlreadyPro = self && self.is_pro;
    if (!newUserAlreadyPro) {
      await sbFetch('/rest/v1/profiles', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify({
          id: newUser.id,
          email: newUser.email,
          is_pro: true,
          pro_plan: 'referral_trial',
          pro_started_at: now.toISOString(),
          pro_expires_at: expiresAt,
          referred_by: validReferrer ? referralCode : null,
          referral_processed: true,
        }),
      });
    } else {
      await sbFetch('/rest/v1/profiles', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify({ id: newUser.id, referral_processed: true }),
      });
    }

    // 5. Grant the referrer a trial too — only if they aren't already Pro.
    if (validReferrer && !referrer.is_pro) {
      await sbFetch('/rest/v1/profiles', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify({
          id: referrer.id,
          is_pro: true,
          pro_plan: 'referral_trial',
          pro_started_at: now.toISOString(),
          pro_expires_at: expiresAt,
        }),
      });
    }

    res.status(200).json({ success: true, granted: !newUserAlreadyPro });
  } catch (err) {
    console.error('apply-referral error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
