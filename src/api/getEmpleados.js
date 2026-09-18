// src/api/getEmpleados.js
export async function obtenerEmpleados() {
  const response = await fetch('/api/empleados', {
    method: 'GET',
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