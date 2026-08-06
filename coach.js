// api/coach.js
//
// Proxies Coach Nova chat requests to Google's Gemini API. This exists
// because the app was previously calling Anthropic's API directly from the
// browser with no API key attached at all — every request silently failed
// and fell back to ~4 canned, keyword-matched replies. Real API keys can
// never live in browser code (anyone can view-source and steal them), so
// this small server-side function holds the key instead. Gemini was chosen
// because it has a genuinely free tier (no credit card, generous daily
// quota) — see https://ai.google.dev/gemini-api/docs/rate-limits for current
// limits, and https://aistudio.google.com/apikey to get a free key.
//
// Required environment variable (Vercel → Settings → Environment Variables):
//   GEMINI_API_KEY   from https://aistudio.google.com/apikey (free, no card)

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Rolling alias for Google's current free-tier-eligible Flash model.
// If you want to pin an exact version instead (more stable, but you'll need
// to update it as Google retires older models), swap this for something like
// "gemini-2.5-flash-lite" — check https://ai.google.dev/gemini-api/docs/models
// for what's currently available.
const MODEL = 'gemini-flash-latest';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!GEMINI_API_KEY) {
    res.status(500).json({ error: 'Coach Nova is not configured yet (missing GEMINI_API_KEY)' });
    return;
  }

  try {
    const { systemPrompt, history, question } = req.body || {};

    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Missing question' });
      return;
    }

    // history comes in as [{role:'user'|'assistant', content:'...'}, ...]
    // (the same shape the app already keeps for Anthropic-style chat).
    // Gemini uses role 'user' | 'model' instead of 'user' | 'assistant'.
    const contents = (Array.isArray(history) ? history : [])
      .slice(-10)
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(m.content || '') }],
      }));
    contents.push({ role: 'user', parts: [{ text: question }] });

    const geminiResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
          contents,
          generationConfig: { maxOutputTokens: 400, temperature: 0.8 },
        }),
      }
    );

    const data = await geminiResp.json();

    if (!geminiResp.ok) {
      console.error('Gemini API error:', data);
      res.status(502).json({ error: 'Coach Nova had trouble responding — please try again' });
      return;
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      res.status(502).json({ error: 'Coach Nova had trouble responding — please try again' });
      return;
    }

    res.status(200).json({ reply });
  } catch (err) {
    console.error('coach.js error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
