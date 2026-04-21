const clients = {
  "cafe-bliss": {
    name: "Cafe Bliss",
    hours: "9AM - 11PM"
  }
};

export default function handler(req, res) {
  const { clientId } = req.body;

  const client = clients[clientId];

  if (!client) {
    return res.status(404).json({ reply: "Client not found" });
  }

  return res.json({
    reply: `${client.name} is open ${client.hours}`
  });
}
