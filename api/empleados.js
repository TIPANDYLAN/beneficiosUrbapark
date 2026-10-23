// api/empleados.js
export default async function handler(req, res) {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://empleados-urbapark.vercel.app', 
  ];

  const origin = req.headers.origin || req.headers.referer;
  const isAllowed = allowedOrigins.some((allowed) => origin?.startsWith(allowed));

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin.replace(/\/$/, ''));
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key, x-app-secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!isAllowed) {
    return res.status(403).json({ message: 'Acceso denegado: Origen no autorizado.' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const urls = [
    'https://sitecdesarrollo.172.10.219.15.sslip.io/webhook/general/empleados/nombres',
    'https://sitecdesarrollo-n8n.9hwbyc.easypanel.host/webhook/general/empleados/nombres',
  ];

  try {
    let empleadosData = null;

    for (const url of urls) {
      try {
        console.log(`[GET] Consultando nombres en: ${url}`);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'x-api-key': process.env.N8N_API_KEY,
          },
        });

        const text = await response.text();
        if (response.ok) {
          const data = text ? JSON.parse(text) : null;
          if (data) {
            empleadosData = Array.isArray(data) ? data : (data.empleados || []);
            break;
          }
        }
      } catch (error) {
        console.error(`-> Error de red en [${url}]:`, error.message);
      }
    }

    if (!empleadosData) {
      return res.status(502).json({ message: 'No se pudo consultar el servicio de nombres.' });
    }

    return res.status(200).json(empleadosData);

  } catch (error) {
    console.error('Error general:', error);
    return res.status(500).json({ message: 'Error interno en el servidor.' });
  }
}