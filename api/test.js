/* api/test.js — temporary debug endpoint
   Visit /api/test in browser to check if Gemini API key + model are working.
   DELETE this file once AI is confirmed working.
*/
export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(200).json({ status: 'NO_KEY', detail: 'GEMINI_API_KEY env var is not set in Vercel' });

  const models = [
    'gemini-2.0-flash',
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
  ];

  const results = {};
  for (const model of models) {
    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Reply with the single word: OK' }] }],
            generationConfig: { maxOutputTokens: 10 }
          })
        }
      );
      const body = await r.text();
      results[model] = { status: r.status, body: body.slice(0, 300) };
    } catch (e) {
      results[model] = { status: 'FETCH_ERROR', body: e.message };
    }
  }

  return res.status(200).json({ keyPrefix: apiKey.slice(0, 8) + '...', results });
}
