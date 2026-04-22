const clients = {
  "adeel-furniture": {
    active: true
  }
};

export default async function handler(req, res) {

  // CORS FIX
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { message, clientId } = req.body;

    if (!message || !clientId) {
      return res.status(400).json({ reply: "Missing data" });
    }

    const client = clients[clientId];

    if (!client) {
      return res.status(404).json({ reply: "Invalid clientId" });
    }

    if (!client.active) {
      return res.status(403).json({ reply: "Service disabled" });
    }

    // 🧠 SAFE OPENROUTER CALL
    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          {
            role: "system",
            content: "You are a helpful furniture assistant. Keep answers short."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await aiRes.json();

    console.log("OPENROUTER RESPONSE:", data);

    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "AI failed to respond";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("BACKEND ERROR:", err);

    return res.status(500).json({
      reply: "Server error (check backend logs)"
    });
  }
}
