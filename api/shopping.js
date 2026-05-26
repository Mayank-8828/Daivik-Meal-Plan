/* api/shopping.js  —  Vercel Serverless Function
   Takes an array of baby meal names and returns a de-duplicated,
   categorised grocery shopping list powered by Gemini 1.5 Flash.

   Environment variable (shared with api/ai.js):
     GEMINI_API_KEY  — free key from https://aistudio.google.com/app/apikey

   POST body: { meals: string[] }
   Response:  { items: [{name, category}] }  |  { error: string }

   Categories returned:
     vege  · fruit  · dal  · grain  · dairy  · spice  · other
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
- Return ONLY valid JSON with no markdown fences, no explanation.

Output format exactly:
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

  // Build a clean, de-duplicated meal list before sending to AI
  const uniqueMeals = [...new Set(meals.filter(m => m && m.trim().length > 2))];

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
          temperature: 0.1,   // low temp → consistent, structured output
          maxOutputTokens: 1200,
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
      return res.status(502).json({ error: `Gemini API error ${geminiRes.status}` });
    }

    const geminiData = await geminiRes.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      return res.status(502).json({ error: 'Empty response from Gemini' });
    }

    // Extract JSON object from the response (Gemini sometimes wraps in ```json)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in Gemini response:', text);
      return res.status(502).json({ error: 'Could not parse Gemini response as JSON' });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed?.items)) {
      return res.status(502).json({ error: 'Unexpected JSON shape from Gemini' });
    }

    // Sanitise categories — only allow known values
    const VALID_CATS = new Set(['vege', 'fruit', 'dal', 'grain', 'dairy', 'spice', 'other']);
    const items = parsed.items
      .filter(i => i.name && typeof i.name === 'string' && i.name.trim().length > 0)
      .map(i => ({
        name: i.name.trim(),
        category: VALID_CATS.has(i.category) ? i.category : 'other',
        checked: false
      }));

    return res.status(200).json({ items });

  } catch (err) {
    console.error('shopping handler error', err);
    return res.status(500).json({ error: err.message });
  }
}
