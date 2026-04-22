const clients = {
  "adeel-furniture": {
    systemPrompt: `
You are the AI assistant for Adeel Furniture House.

RULES:
- Never guess prices
- Always redirect to WhatsApp for price
- Be short and simple

BUSINESS INFO:
- Beds, wardrobes, bedroom sets
- Foam mattresses
- Chairs and sofas
- Custom furniture available
- WhatsApp: 923142223546
`
  },

  "client-2": {
    systemPrompt: `
You are the AI assistant for Pizza Store.

RULES:
- Never guess prices
- Always recommend menu
`
  }
};

export default async function handler(req, res) {
  try {
    const { message, clientId } = req.body;

    const client = clients[clientId];

    if (!client) {
      return res.status(404).json({ reply: "Client not found" });
    }

    const systemPrompt = client.systemPrompt;

    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
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
