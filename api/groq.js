// api/groq.js - VERSION CORRIGÉE ULTRA-SIMPLE
export default async function handler(req, res) {
  // Autoriser CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  console.log('🔑 Clé API:', GROQ_API_KEY ? 'PRÉSENTE' : 'MANQUANTE');
  
  if (!GROQ_API_KEY) {
    return res.status(500).json({ 
      error: 'Clé API manquante sur le serveur. Vérifiez la variable GROQ_API_KEY sur Vercel.' 
    });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || 'Erreur Groq API' 
      });
    }

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ 
      error: 'Erreur: ' + error.message 
    });
  }
}
