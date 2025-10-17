// api/test-env.js - Pour vérifier les variables d'environnement
export default async function handler(req, res) {
  res.json({
    groqKeyPresent: !!process.env.GROQ_API_KEY,
    groqKeyLength: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0,
    groqKeyStart: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 10) + '...' : 'null',
    allEnvVars: Object.keys(process.env)
  });
}
