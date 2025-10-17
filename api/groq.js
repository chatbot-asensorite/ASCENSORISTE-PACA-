// api/groq.js
export default async function handler(req, res) {
  // Gérer les préflight CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Vérifier la méthode
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  try {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      console.error('❌ Clé API Groq non configurée dans les variables d\'environnement');
      return res.status(500).json({ 
        error: 'Configuration serveur manquante. Contactez l\'administrateur.' 
      });
    }

    console.log('🔧 Envoi de la requête à Groq API...');
    
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('❌ Erreur Groq API:', groqResponse.status, errorText);
      throw new Error(`Erreur Groq API: ${groqResponse.status} - ${errorText}`);
    }

    const data = await groqResponse.json();
    console.log('✅ Réponse Groq reçue avec succès');
    
    // Headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    res.status(200).json(data);
    
  } catch (error) {
    console.error('❌ Erreur dans le handler Groq:', error);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ 
      error: `Erreur serveur: ${error.message}` 
    });
  }
}
