/**
 * Obtiene el listado completo de parqueaderos desde la API serverless interna
 * @returns {Promise<Array<{codigo: string, nombre: string, movilizacion: string}>>}
 */
export async function getParqueaderos() {
  try {
    const response = await fetch('/api/parqueaderos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    const data = await response.json();

    // Garantizar que la respuesta sea un array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error al consultar parqueaderos:', error.message);
    throw error;
  }
}