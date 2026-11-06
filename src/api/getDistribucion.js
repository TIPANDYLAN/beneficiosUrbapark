/**
 * Obtiene los grupos de supervisión y la relación de empleados desde la API
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

    let data = await response.json();
    console.log("🔍 RAW API DISTRIBUCION (Respuesta cruda):", data);

    // Si n8n devuelve un array (ej. [ { json: { gruposSupervision, ... } } ] o [ { gruposSupervision, ... } ])
    if (Array.isArray(data) && data.length > 0) {
      data = data[0];
      if (data && data.json) {
        data = data.json;
      }
    } else if (data && data.json) {
      // Si viene como un solo objeto envuelto en .json
      data = data.json;
    }

    // Extraer de forma segura
    const gruposSupervision = Array.isArray(data?.gruposSupervision) ? data.gruposSupervision : [];
    const relacionEmpleadosGrupos = Array.isArray(data?.relacionEmpleadosGrupos) ? data.relacionEmpleadosGrupos : [];

    console.log("✅ Procesados - Grupos:", gruposSupervision.length, "| Relaciones:", relacionEmpleadosGrupos.length);

    return {
      gruposSupervision,
      relacionEmpleadosGrupos,
    };
  } catch (error) {
    console.error('❌ Error al consultar la distribución de supervisores:', error.message);
    return { gruposSupervision: [], relacionEmpleadosGrupos: [] };
  }
}