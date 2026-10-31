/**
 * Vercel Serverless Function: /api/config
 * Retorna la URL de Google Apps Script configurada en las variables de entorno de Vercel (GAS_URL)
 */

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Lectura de la variable de entorno en Vercel
  const gasUrl = process.env.GAS_URL || "https://script.google.com/macros/s/AKfycbwnvzDi1tY360LgFpESlfPMFkr2ZgLenTL-3fIm5E_zyyB0q13gztiTbgY2POTIn34/exec";

  return res.status(200).json({
    status: "success",
    gasUrl: gasUrl,
    source: process.env.GAS_URL ? "vercel_env" : "default"
  });
}
