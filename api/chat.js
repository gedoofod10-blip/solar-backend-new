export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { messages } = req.body; 

    let systemInstruction = "";
    const geminiMessages = [];

    messages.forEach(msg => {
      if (msg.role === "system") {
        systemInstruction = msg.content;
      } else {
        geminiMessages.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        });
      }
    });

    // استدعاء مفتاح جوجل السري من Vercel
    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: geminiMessages
      })
    });

    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    const reply = data.candidates[0].content.parts[0].text;
    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "خطأ في السيرفر" });
  }
}
