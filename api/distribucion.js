// api/distribucion.js
export default async function handler(req, res) {
  // 1. Definir dominios permitidos
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://empleados-urbapark.vercel.app', 
  ];

  const origin = req.headers.origin || req.headers.referer;

  // Verificar origen de la petición
  const isAllowed = allowedOrigins.some((allowed) => origin?.startsWith(allowed));

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin.replace(/\/$/, ''));
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  // Manejar preflight (CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. BLOQUEO de orígenes no autorizados
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
      'https://sitecdesarrollo.172.10.219.15.sslip.io/webhook/parqueadero/distribucion',
      'https://sitecdesarrollo.9hwbyc.easypanel.host/webhook/parqueadero/distribucion',
    ];

    for (const url of urls) {
      try {
        console.log(`[GET] Consultando distribución: ${url}`);
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
      message: 'No se pudo consultar ninguna URL de distribución disponible.',
    });
  } catch (error) {
    console.error('Error general:', error);
    return res.status(500).json({
      message: 'No se pudo conectar con el servicio de distribución.',
    });
  }
}