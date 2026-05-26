/* api/shopping.js  —  Vercel Serverless Function
   Takes an array of baby meal names and returns a de-duplicated,
   categorised grocery shopping list powered by Gemini 1.5 Flash.

   Environment variable (shared with api/ai.js):
     GEMINI_API_KEY  — free key from https://aistudio.google.com/app/apikey

   POST body: { meals: string[] }
   Response:  { items: [{name, category}] }  |  { error: string }

   Categories: vege · fruit · dal · grain · dairy · spice · other
*/

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const SYSTEM_PROMPT = `You are a helpful assistant for parents introducing solid foods to a baby.

Given a list of baby meal names, extract every unique grocery item that needs to be purchased.
Categorise each item as exactly one of: vege, fruit, dal, grain, dairy, spice, other.

Category guide:
- vege  : all vegetables (palak, carrot, broccoli, potato, sweet potato, pumpkin, etc.)
- fruit : all fruits (apple, banana, mango, papaya, pear, etc.)
- dal   : dals, pulses & legumes (moong dal, tur dal, masoor, rajma, chole, etc.)
- grain : grains & cereals (rice, ragi, oats, wheat, rava, suji, samo, bajra, jowar, etc.)
- dairy : milk, ghee, curd, paneer, butter, cream (skip breastmilk entirely)
- spice : spices, herbs & condiments (jeera, hing, haldi, elaichi, cinnamon, kadi patta, etc.)
- other : everything else (coconut oil, tamarind, jaggery, etc.)

Rules:
- Skip generic placeholders like "Any vege from Section", "Any fruit", breastmilk, water.
- De-duplicate: list each item only once even if it appears in multiple meals.
- Use clean, short names (e.g. "Moong Dal" not "Moong dal (no chilka) with hing & haldi").
- Extract ingredients hidden in compound names: "Ragi porridge with elaichi" → Ragi (grain) + Elaichi (spice).

Return ONLY a JSON object in this exact format, no extra text:
{"items":[{"name":"Ragi","category":"grain"},{"name":"Elaichi","category":"spice"}]}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { meals } = req.body || {};
  if (!Array.isArray(meals) || meals.length === 0) {
    return res.status(400).json({ error: 'Missing meals array' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
  }

  // De-duplicate and filter trivially empty entries before sending to AI
  const uniqueMeals = [...new Set(meals.filter(m => m && m.trim().length > 2))];
  if (!uniqueMeals.length) {
    return res.status(200).json({ items: [] });
  }

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nMeals this week:\n${uniqueMeals.map((m, i) => `${i + 1}. ${m}`).join('\n')}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1500,
          topP: 0.9,
          responseMimeType: 'application/json'
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
      return res.status(502).json({ error: `Gemini API error ${geminiRes.status}: ${errBody.slice(0, 200)}` });
    }

    const geminiData = await geminiRes.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      const finishReason = geminiData?.candidates?.[0]?.finishReason;
      console.error('Empty Gemini response, finishReason:', finishReason, JSON.stringify(geminiData).slice(0, 500));
      return res.status(502).json({ error: `Empty Gemini response (reason: ${finishReason || 'unknown'})` });
    }

    // Parse JSON — responseMimeType:"application/json" means text IS the JSON,
    // but fall back to regex extraction in case the model adds any surrounding text.
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (_) {
      const match = text.match(/\{[\s\S]*"items"[\s\S]*\}/);
      if (!match) {
        console.error('No JSON found in Gemini response:', text.slice(0, 300));
        return res.status(502).json({ error: 'Could not parse Gemini response as JSON' });
      }
      try {
        parsed = JSON.parse(match[0]);
      } catch (parseErr) {
        console.error('JSON.parse failed:', text.slice(0, 300));
        return res.status(502).json({ error: 'Gemini returned malformed JSON' });
      }
    }

    if (!Array.isArray(parsed?.items)) {
      console.error('Unexpected shape:', JSON.stringify(parsed).slice(0, 300));
      return res.status(502).json({ error: 'Unexpected shape from Gemini' });
    }

    // Sanitise — only allow known categories
    const VALID_CATS = new Set(['vege', 'fruit', 'dal', 'grain', 'dairy', 'spice', 'other']);
    const items = parsed.items
      .filter(i => i.name && typeof i.name === 'string' && i.name.trim().length > 0)
      .map(i => ({
        name:     i.name.trim(),
        category: VALID_CATS.has(i.category) ? i.category : 'other',
        checked:  false
      }));

    return res.status(200).json({ items });

  } catch (err) {
    console.error('shopping handler error', err);
    return res.status(500).json({ error: err.message });
  }
}
