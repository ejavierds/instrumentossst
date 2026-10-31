/**
 * Endpoint de configuración de entorno del servidor
 * Retorna exclusivamente parámetros públicos de conectividad.
 * NUNCA expone contraseñas, claves ni secretos en la respuesta HTTP.
 */

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Lectura segura de la URL del endpoint del servidor (sin exponer credenciales)
  const gasUrl = process.env.GAS_URL || "https://script.google.com/macros/s/AKfycbwnvzDi1tY360LgFpESlfPMFkr2ZgLenTL-3fIm5E_zyyB0q13gztiTbgY2POTIn34/exec";

  return res.status(200).json({
    status: "success",
    gasUrl: gasUrl,
    authRequired: true,
    source: process.env.GAS_URL ? "env" : "default"
  });
}
