export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { messages, model, max_tokens, temperature } = req.body;

      const response = await fetch("https://api.groq.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: model || "mixtral-8x7b-32768",
          messages: messages || [{ role: "user", content: "Bonjour" }],
          max_tokens: max_tokens || 500,
          temperature: temperature || 0.3
        }),
      });

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

