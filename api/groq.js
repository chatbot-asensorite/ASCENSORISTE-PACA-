// api/groq.js - VERSION AVEC GESTION D'ERREURS COMPLÈTE
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Get API key from environment
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    
    console.log('🔧 API Key present:', !!GROQ_API_KEY);
    
    if (!GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY is missing in environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error: GROQ_API_KEY not found' 
      });
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = JSON.parse(JSON.stringify(req.body));
    } catch (parseError) {
      return res.status(400).json({ error: 'Invalid JSON in request body' });
    }

    // Ensure model is set correctly
    const groqRequestBody = {
      ...requestBody,
      model: requestBody.model || "llama-3.1-8b-instant"
    };

    console.log('🚀 Sending to Groq API, model:', groqRequestBody.model);

    // Call Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groqRequestBody),
      timeout: 30000
    });

    // Get response text first to handle errors
    const responseText = await groqResponse.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse Groq response:', responseText);
      return res.status(500).json({ 
        error: 'Invalid response from Groq API' 
      });
    }

    // Check if Groq API returned an error
    if (!groqResponse.ok) {
      console.error('❌ Groq API error:', data);
      return res.status(groqResponse.status).json({
        error: data.error?.message || `Groq API error: ${groqResponse.status}`,
        type: data.error?.type,
        code: data.error?.code
      });
    }

    console.log('✅ Groq API success');
    
    // Return successful response
    return res.status(200).json(data);

  } catch (error) {
    console.error('❌ Server error in Groq handler:', error);
    
    return res.status(500).json({ 
      error: `Internal server error: ${error.message}` 
    });
  }
}
