const { OpenAI } = require('openai');

export default async function handler(req, res) {
  // السماح بالاتصال من أي مكان (تطبيقتك)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // استدعاء المفتاح السري المخزن في Vercel
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { messages } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: messages,
    });

    res.status(200).json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "حصل خطأ في السيرفر" });
  }
}
