const clients = {
  "cafe-bliss": {
    name: "Cafe Bliss",
    logo: "https://example.com/logo.png",
    color: "#ff4d4d",
    hours: "9AM - 11PM",
    apiKey: "key_12345",
    menu: ["Biryani", "Burger", "Pasta"]
  }
};
export default async function handler(req, res) {
  const { message, clientId, apiKey } = req.body;

  const client = clients[clientId];

  if (!client) {
    return res.status(404).json({ reply: "Client not found" });
  }

  if (client.apiKey !== apiKey) {
    return res.status(403).json({ reply: "Invalid API key" });
  }

  if (!client.active) {
    return res.status(403).json({
      reply: "Service disabled. Please contact support."
    });
  }

  // 🧠 Build prompt
const prompt = `
You are a restaurant assistant for ${client.name}.

STRICT RULES (MUST FOLLOW):

1. ONLY speak:
   - English
   - Roman Urdu (English letters only)

2. Language:
   - English input → English reply
   - Roman Urdu input → Roman Urdu reply

3. Greeting:
   - "hi" → "Hi, how can I assist you?"
   - "assalamualaikum" → "Walaikum assalam, mai aap ki kaise madad kar sakta hun?"

4. MENU RULE (VERY IMPORTANT):
   - ONLY show items from this menu:
     ${client.menu.join(", ")}
   - DO NOT add anything else
   - DO NOT invent food

5. If user asks for menu:
   - list items in short bullet style
   - Reply SHORT
   
6. Keep replies:
   - Clear
   - Only English or Roman Urdu
   - VERY SHORT answers (1–3 lines max)
   - No long paragraphs
   - No extra storytelling
   - Be friendly and natural
User:
${message}
`;

  try {
    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await aiRes.json();

    const reply = data.choices?.[0]?.message?.content || "No response";

    return res.json({ reply });

  } catch (err) {
    return res.status(500).json({
      reply: "Error talking to AI"
    });
  }
}
