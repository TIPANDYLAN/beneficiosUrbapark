/**
 * Obtiene el listado de porcentajes de distribución base por parqueadero
 * @returns {Promise<Array<{name: string, cost_center_code: string, percentage: number}>>}
 */
export async function getDistribucion() {
  try {
    const response = await fetch('/api/distribucion', {
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

    if (!Array.isArray(data)) return [];

    // Formateamos los campos para uso directo en JavaScript
    return data.map((item) => ({
      nombre: item.name,
      codigo: item.cost_center_code,
      porcentajeBase: parseFloat(item.percentage) || 0,
    }));
  } catch (error) {
    console.error('Error al consultar porcentajes de distribución:', error.message);
    throw error;
  }
}