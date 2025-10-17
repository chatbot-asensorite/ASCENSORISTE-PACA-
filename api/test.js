// api/test.js - Pour tester les variables d'environnement
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const envInfo = {
    groqKeyExists: !!process.env.GROQ_API_KEY,
    groqKeyLength: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0,
    nodeEnv: process.env.NODE_ENV,
    vercel: process.env.VERCEL,
    allEnvVars: Object.keys(process.env).filter(key => 
      key.includes('GROQ') || key.includes('API') || key.includes('KEY')
    )
  };
  
  console.log('🔍 Environment check:', envInfo);
  res.status(200).json(envInfo);
}
