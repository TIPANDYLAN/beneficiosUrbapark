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

    let data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      data = data[0];
      if (data && data.json) {
        data = data.json;
      }
    } else if (data && data.json) {
      data = data.json;
    }

    const gruposSupervision = Array.isArray(data?.gruposSupervision) ? data.gruposSupervision : [];
    const relacionEmpleadosGrupos = Array.isArray(data?.relacionEmpleadosGrupos) ? data.relacionEmpleadosGrupos : [];

    return {
      gruposSupervision,
      relacionEmpleadosGrupos,
    };
  } catch (error) {
    console.error('❌ Error al consultar la distribución de supervisores:', error.message);
    return { gruposSupervision: [], relacionEmpleadosGrupos: [] };
  }
}