/**
 * Vercel Serverless Function: /api/proxy
 * Proxy seguro para peticiones GET y POST hacia Google Apps Script usando la variable de entorno GAS_URL
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const targetUrl = process.env.GAS_URL || "https://script.google.com/macros/s/AKfycbwnvzDi1tY360LgFpESlfPMFkr2ZgLenTL-3fIm5E_zyyB0q13gztiTbgY2POTIn34/exec";

  try {
    if (req.method === 'GET') {
      const queryParams = new URLSearchParams(req.query).toString();
      const fetchUrl = queryParams ? `${targetUrl}?${queryParams}` : targetUrl;
      const gasResponse = await fetch(fetchUrl);
      const data = await gasResponse.json();
      return res.status(200).json(data);
    } else if (req.method === 'POST') {
      const bodyContent = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const gasResponse = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: bodyContent
      });
      const data = await gasResponse.json();
      return res.status(200).json(data);
    } else {
      return res.status(405).json({ status: 'error', message: 'Método HTTP no permitido.' });
    }
  } catch (error) {
    console.error("Error en proxy de Google Apps Script:", error);
    return res.status(500).json({
      status: 'error',
      message: 'Fallo al conectar con el backend de Google Apps Script: ' + error.message
    });
  }
}
