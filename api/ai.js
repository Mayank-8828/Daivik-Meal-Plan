/* api/ai.js  —  Vercel Serverless Function
   Accepts a raw diet report, sends it to Gemini 1.5 Flash, and returns a
   warm WhatsApp-ready summary that Mom or Dad can send to the dietician.

   Environment variable required (Vercel Dashboard → Settings → Environment):
     GEMINI_API_KEY  — free key from https://aistudio.google.com/app/apikey
                       (no credit card, 1,500 requests/day free tier)

   POST body: { report: string }
   Response:  { text: string }  |  { error: string }
*/

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `You are helping parents of a 7-month-old baby (named Daivik) send a diet update to their dietician via WhatsApp.

Given the raw tracking data below, write a warm, concise message (2–3 short paragraphs, under 150 words) that:
- Opens with how the week went overall (feeding rate, baby's mood at meals)
- Highlights any reactions or concerns clearly but calmly
- Mentions what is working well and any new foods tried
- Ends with a specific question if there are concerns, or a brief warm close if everything is fine

Rules:
- Use simple, friendly language — write as if a parent is texting their doctor
- Do NOT use bullet points, markdown, or asterisks
- Do NOT start with "Hi" or "Dear" — let the parent personalise the greeting
- Keep it under 150 words
- Be warm and reassuring, not clinical`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { report } = req.body || {};
  if (!report || typeof report !== 'string') {
    return res.status(400).json({ error: 'Missing report string' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
  }

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${SYSTEM_PROMPT}\n\nRaw tracking data:\n${report}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
          topP: 0.9
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
        ]
      })
    });

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      console.error('Gemini error', geminiRes.status, errBody);
      if (geminiRes.status === 429) {
        return res.status(429).json({ error: 'quota_exceeded' });
      }
      if (geminiRes.status === 404) {
        return res.status(404).json({ error: 'model_not_found' });
      }
      return res.status(502).json({ error: `Gemini API error ${geminiRes.status}` });
    }

    const geminiData = await geminiRes.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      return res.status(502).json({ error: 'Empty response from Gemini' });
    }

    return res.status(200).json({ text });

  } catch (err) {
    console.error('ai handler error', err);
    return res.status(500).json({ error: err.message });
  }
}
