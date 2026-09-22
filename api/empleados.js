// api/empleados.js
export default async function handler(req, res) {
  // 1. Definir dominios permitidos (desarrollo local y producción)
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://empleados-urbapark.vercel.app', 
  ];

  const origin = req.headers.origin || req.headers.referer;

  // Verificar si el origen de la petición pertenece a tu lista
  const isAllowed = allowedOrigins.some((allowed) => origin?.startsWith(allowed));

  // Si el origen está permitido, devolvemos su cabecera en lugar del asterisco '*'
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin.replace(/\/$/, ''));
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  // Manejar preflight (CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. BLOQUEO: Si la llamada NO viene de tus dominios autorizados, cortar ejecución
  if (!isAllowed) {
    return res.status(403).json({
      message: 'Acceso denegado: Origen no autorizado.',
    });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      message: 'Método no permitido',
    });
  }

  try {
    const urls = [
      'https://n8n.172.10.219.15.sslip.io/webhook/empleados/activos',
      'https://sitecapn-n8n.9hwbyc.easypanel.host/webhook/empleados/activos',
    ];

    for (const url of urls) {
      try {
        console.log(`[GET] Consultando: ${url}`);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'x-api-key': process.env.N8N_API_KEY,
          },
        });

        const text = await response.text();
        console.log(`-> Status [${url}]:`, response.status);

        let data;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = { raw: text };
        }

        if (response.ok) {
          return res.status(200).json(data);
        }
      } catch (error) {
        console.error(`-> Error de red/fetch en [${url}]:`, error.message, error.cause);
      }
    }

    return res.status(502).json({
      message: 'No se pudo consultar ninguna URL disponible.',
    });
  } catch (error) {
    console.error('Error general:', error);
    return res.status(500).json({
      message: 'No se pudo conectar con el servicio de consulta.',
    });
  }
}