import { NextResponse } from 'next/server';

export async function GET(request) {
  // 1. Obtener la clave enviada por el frontend
  const clientSecret = request.headers.get('x-app-secret');

  // 2. Comparar con la clave privada guardada en el servidor
  if (clientSecret !== process.env.INTERNAL_APP_SECRET) {
    return NextResponse.json(
      { error: 'Acceso denegado: Petición no autorizada' },
      { status: 403 }
    );
  }

  // 3. Si coincide, recién llamar a n8n
  try {
    const resN8n = await fetch(process.env.N8N_WEBHOOK_URL, {
      headers: {
        'x-api-key': process.env.N8N_API_KEY,
      },
    });

    const data = await resN8n.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error interno en el servidor' }, { status: 500 });
  }
}