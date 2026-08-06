// api/verify-payment.js
//
// Verifies a Flutterwave payment SERVER-SIDE before granting FitHerNova Pro.
// Previously the browser marked a user as Pro itself right after Flutterwave's
// inline checkout fired its "success" callback — with no proof the payment
// actually cleared. Anyone with dev tools could call that same Supabase write
// directly and get Pro for free. This function is the only thing now allowed
// to grant Pro: it re-checks the transaction with Flutterwave using a secret
// key that never reaches the browser, then writes the result to Supabase
// using the service-role key (also never exposed to the browser).
//
// Required environment variables (set in Vercel → Settings → Environment Variables):
//   FLW_SECRET_KEY              Your Flutterwave secret key (Flutterwave dashboard → Settings → API)
//   SUPABASE_URL                https://norgzcztduoxkshtthkm.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY   Supabase dashboard → Project Settings → API → service_role secret
//   SUPABASE_ANON_KEY           Supabase dashboard → Project Settings → API → anon public key

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;

const PLAN_PRICES_USD = { monthly: 3, annual: 22, lifetime: 40 };

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { transactionId, plan } = req.body || {};

    if (!transactionId || !plan || !PLAN_PRICES_USD[plan]) {
      res.status(400).json({ verified: false, reason: 'Missing or invalid transactionId/plan' });
      return;
    }

    // 1. Identify the calling user from their Supabase session token.
    //    Never trust a user id sent directly from the client.
    const authHeader = req.headers.authorization || '';
    const accessToken = authHeader.replace(/^Bearer\s+/i, '');
    if (!accessToken) {
      res.status(401).json({ verified: false, reason: 'Not signed in' });
      return;
    }

    const userResp = await fetch(SUPABASE_URL + '/auth/v1/user', {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + accessToken,
      },
    });
    if (!userResp.ok) {
      res.status(401).json({ verified: false, reason: 'Invalid session' });
      return;
    }
    const user = await userResp.json();
    if (!user || !user.id) {
      res.status(401).json({ verified: false, reason: 'Invalid session' });
      return;
    }

    // 2. Verify the transaction with Flutterwave directly (server-to-server).
    const flwResp = await fetch(
      'https://api.flutterwave.com/v3/transactions/' + encodeURIComponent(transactionId) + '/verify',
      { headers: { 'Authorization': 'Bearer ' + FLW_SECRET_KEY } }
    );
    const flwData = await flwResp.json();

    const tx = flwData && flwData.data;
    const expectedAmount = PLAN_PRICES_USD[plan];

    const isGenuine =
      flwResp.ok &&
      flwData.status === 'success' &&
      tx &&
      tx.status === 'successful' &&
      tx.currency === 'USD' &&
      Number(tx.amount) >= expectedAmount - 0.01; // tiny float-rounding buffer

    if (!isGenuine) {
      res.status(402).json({ verified: false, reason: 'Payment could not be verified' });
      return;
    }

    // 3. Write Pro status to Supabase using the service-role key, which
    //    bypasses RLS. This is the ONLY path that should ever be able to
    //    set is_pro = true (see the RLS lockdown migration).
    const upsertResp = await fetch(SUPABASE_URL + '/rest/v1/profiles', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        id: user.id,
        email: user.email,
        is_pro: true,
        pro_plan: plan,
        pro_reference: String(transactionId),
        pro_started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });

    if (!upsertResp.ok) {
      const errText = await upsertResp.text();
      console.error('Supabase upsert failed:', errText);
      res.status(500).json({ verified: false, reason: 'Payment verified but activation failed — contact support' });
      return;
    }

    res.status(200).json({ verified: true, plan });
  } catch (err) {
    console.error('verify-payment error:', err);
    res.status(500).json({ verified: false, reason: 'Server error' });
  }
};
