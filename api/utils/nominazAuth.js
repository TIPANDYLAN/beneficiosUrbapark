// api/utils/nominazAuth.js

let cachedToken = null;
let tokenExpiration = 0;

export async function getNominazToken() {
  const now = Date.now();

  // Si ya tenemos un token válido en memoria, lo reusamos (ahorra tiempo de red)
  if (cachedToken && now < tokenExpiration) {
    console.log('[Auth] Reutilizando token existente en memoria.');
    return cachedToken;
  }

  console.log('[Auth] Solicitando nuevo token a NominaZ...');
  const response = await fetch('https://cloud.nominaz.com/role_manager/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.NOMINAZ_CLIENT_ID,
      client_secret: process.env.NOMINAZ_CLIENT_SECRET,
      grant_type: 'client_credentials'
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al autenticar con NominaZ: ${errorText}`);
  }

  const data = await response.json();
  cachedToken = data.access_token || data.token;

  // Calculamos la expiración (si NominaZ da expires_in en segundos, lo usamos; si no, por defecto 50 minutos)
  const expiresIn = data.expires_in || 3600;
  tokenExpiration = now + (expiresIn - 60) * 1000; // Margen de seguridad de 1 minuto antes de que expire

  return cachedToken;
}