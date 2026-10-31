/**
 * Endpoint de configuración de entorno del servidor
 * Retorna la URL del endpoint del servidor configurada en variables de entorno (GAS_URL)
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

  // Lectura de variables de entorno del servidor
  const gasUrl = process.env.GAS_URL || "https://script.google.com/macros/s/AKfycbwnvzDi1tY360LgFpESlfPMFkr2ZgLenTL-3fIm5E_zyyB0q13gztiTbgY2POTIn34/exec";
  const dashboardPassword = process.env.DASHBOARD_PASSWORD || 
                           process.env.ADMIN_PASSWORD || 
                           process.env.CONFIG_PASSWORD || 
                           process.env.SST_PASSWORD || 
                           "Salud_2026";

  return res.status(200).json({
    status: "success",
    gasUrl: gasUrl,
    dashboardPassword: dashboardPassword,
    source: process.env.GAS_URL ? "env" : "default"
  });
}
