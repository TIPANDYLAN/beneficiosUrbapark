// La lista de contratación se consulta exclusivamente en n8n.
export default async function handler(req, res) {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://empleados-urbapark.vercel.app',
    'https://beneficios-urbapark.vercel.app',
    ...[process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]
      .filter(Boolean).map(host => `https://${host}`),
  ];
  let origin;
  try {
    origin = new URL(req.headers.origin || req.headers.referer).origin;
  } catch {
    return res.status(403).json({ message: 'Acceso denegado: Origen no autorizado.' });
  }
  if (!allowedOrigins.includes(origin)) {
    return res.status(403).json({ message: 'Acceso denegado: Origen no autorizado.' });
  }
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).json({ message: 'Método no permitido' });
  }
  if (!process.env.N8N_API_KEY) {
    return res.status(503).json({ message: 'La conexión con n8n no está configurada.' });
  }
  const urls = [
    'https://sitecdesarrollo-n8n.9hwbyc.easypanel.host/webhook/general/empleados/nombres',
    'https://sitecapn-n8n.9hwbyc.easypanel.host/webhook/empleados/activos',
  ];
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: { 'x-api-key': process.env.N8N_API_KEY },
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) continue;
      const data = await response.json();
      const rows = Array.isArray(data) ? data : data?.empleados ?? data?.data;
      if (!Array.isArray(rows)) continue;
      return res.status(200).json(rows);
    } catch {
      // Intentar el siguiente webhook sin registrar claves ni datos personales.
    }
  }
  return res.status(502).json({ message: 'No se pudo consultar la lista de empleados de n8n. Intente nuevamente.' });
}
