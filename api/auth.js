/**
 * Endpoint serverless para verificación de credenciales de seguridad
 * Valida la contraseña administrativa configurada en variables de entorno (DASHBOARD_PASSWORD / ADMIN_PASSWORD)
 * Por defecto: "Salud_2026"
 */

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: "error", message: "Método HTTP no permitido." });
  }

  const expectedPassword = (
    process.env.DASHBOARD_PASSWORD || 
    process.env.ADMIN_PASSWORD || 
    process.env.CONFIG_PASSWORD || 
    process.env.SST_PASSWORD || 
    "Salud_2026"
  ).trim();

  const { password } = req.body || {};

  if (password && String(password).trim() === expectedPassword) {
    return res.status(200).json({
      status: "success",
      authorized: true,
      message: "Credencial validada exitosamente."
    });
  } else {
    return res.status(401).json({
      status: "error",
      authorized: false,
      message: "Contraseña incorrecta. Acceso restringido."
    });
  }
}
