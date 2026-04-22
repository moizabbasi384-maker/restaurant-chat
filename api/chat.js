const clients = {
  "cafe-bliss": {
    apiKey: "key_12345",
    active: true
  }
};

export default async function handler(req, res) {
  try {
    const { message, clientId } = req.body;

    if (!message || !clientId) {
      return res.status(400).json({ reply: "Missing data" });
    }

    const client = clients[clientId];

    if (!client) {
      return res.status(404).json({ reply: "Client not found" });
    }

    if (!client.active) {
      return res.status(403).json({ reply: "Service disabled" });
    }

    // 🧠 MINIMAL prompt only (NO business logic)
    const prompt = message;

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

    return res.json({
      reply: data?.choices?.[0]?.message?.content || "No response"
    });

  } catch (err) {
    return res.status(500).json({ reply: "Server error" });
  }
}
