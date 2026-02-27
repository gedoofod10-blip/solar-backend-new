export default async function handler(req, res) {
  // 1. السماح للتطبيق بالاتصال
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(200).json({ reply: "السيرفر شغال بمكنة Groq الصاروخية! 🚀" });
  }

  try {
    const API_KEY = process.env.GROQ_API_KEY;
    if (!API_KEY) {
      return res.status(200).json({ reply: "⚠️ المفتاح مافي! تأكد من إضافته في Vercel باسم GROQ_API_KEY." });
    }

    const { messages } = req.body;

    // 2. الاتصال بسيرفرات Groq
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // نموذج لاما 3 السريع والمجاني
        messages: messages
      })
    });

    const data = await response.json();

    // 3. صيد الأخطاء لو حصلت وعرضها في الشات
    if (data.error) {
      return res.status(200).json({ reply: `⚠️ خطأ من سيرفر Groq: ${data.error.message}` });
    }

    // 4. إرجاع الرد الناجح للتطبيق
    const replyText = data.choices[0].message.content;
    return res.status(200).json({ reply: replyText });

  } catch (error) {
    return res.status(200).json({ reply: `⚠️ خطأ داخلي في الاتصال: ${error.message}` });
  }
}
