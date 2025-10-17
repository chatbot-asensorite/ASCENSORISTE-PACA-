// api/groq.js - VERSION CORRIGÉE
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Votre NOUVELLE clé Groq (remplacez par la nouvelle clé)
  const GROQ_API_KEY = process.env.GROQ_API_KEY || "gsk_votre_nouvelle_clé_complète_ici";

  try {
    console.log('🔧 Calling Groq API...');
    
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
      console.error('❌ Groq API error:', data);
      return res.status(response.status).json(data);
    }

    console.log('✅ Groq API success');
    res.status(200).json(data);

  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: error.message });
  }
}
