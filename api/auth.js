/**
 * Endpoint serverless para verificación segura de credenciales
 * Valida la contraseña configurada en las variables de entorno del servidor (DASHBOARD_PASSWORD / ADMIN_PASSWORD)
 * La verificación se ejecuta enteramente en el servidor sin exponer la clave al cliente.
 */

import crypto from 'crypto';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: "error", message: "Método HTTP no permitido." });
  }

  // Obtener contraseña esperada exclusivamente de variables de entorno del servidor
  const expectedPassword = (
    process.env.DASHBOARD_PASSWORD || 
    process.env.ADMIN_PASSWORD || 
    process.env.CONFIG_PASSWORD || 
    process.env.SST_PASSWORD || 
    ""
  ).trim();

  if (!expectedPassword) {
    return res.status(500).json({
      status: "error",
      authorized: false,
      message: "Credencial de seguridad no configurada en las variables de entorno del servidor."
    });
  }

  const { password } = req.body || {};
  const userPassword = (password ? String(password).trim() : "");

  // Comparación en tiempo constante para mitigar ataques de temporización (timing attacks)
  const bufUser = Buffer.from(userPassword, 'utf8');
  const bufExpected = Buffer.from(expectedPassword, 'utf8');

  let isMatch = false;
  if (bufUser.length === bufExpected.length) {
    isMatch = crypto.timingSafeEqual(bufUser, bufExpected);
  }

  if (isMatch) {
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
