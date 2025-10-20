// api/groq.js - VERSION ESM PUR
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gestion des préflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Vérification de la méthode
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  // Vérification de la clé API
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY manquante' });
  }

  try {
    // Appel à l'API Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Erreur API Groq:', error);
    res.status(500).json({ error: error.message });
  }
}
