// src/api/postCupo.js
export async function consultarCupo(cedula) {
  const response = await fetch('/api/cupo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cedula }),
  });

  const text = await response.text();

  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(
      data?.message || `La consulta falló con estado ${response.status}`
    );
  }

  return data;
}