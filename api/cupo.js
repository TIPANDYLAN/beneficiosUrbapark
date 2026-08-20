// api/cupo.js
export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Método no permitido',
    });
  }

  try {
    const { cedula } = req.body;

    if (!cedula) {
      return res.status(400).json({
        message: 'Debe ingresar una cédula.',
      });
    }

    const urls = [
      'https://sitecdesarrollo-n8n.9hwbyc.easypanel.host/webhook/empleados/cupo',
      'http://sitecdesarrollo.172.10.219.15.sslip.io/webhook/empleados/cupo',
    ];

const apiKey = process.env.N8N_API_KEY || 'u37khX9gYj2Ns5rPAWq4EtZcLVtMoF16';

    for (const url of urls) {
      try {
        console.log(`[POST] Consultando: ${url}`);
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.N8N_API_KEY,
          },
          body: JSON.stringify({
            cedula: cedula.trim(),
          }),
        });

        const text = await response.text();
        console.log(`-> Status [${url}]:`, response.status);
        console.log(`-> Body [${url}]:`, text);
        console.log('Valor enviado en x-api-key:', process.env.N8N_API_KEY);

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