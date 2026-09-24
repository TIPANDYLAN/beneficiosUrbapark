// src/api/getEmpleados.js

// Mappeador: Define la equivalencia entre la API externa y tu modelo interno
function mapEmpleado(raw) {
  return {
    cedula: raw.DOCI_MFEMP || raw.documento || raw.identificacion || '',
    nombre: raw.NOMBRES || raw.nombres || raw.full_name || 'Sin nombre',
    apellido: raw.APELLIDOS || raw.apellidos || '',
    cargo: raw.CAR_DESCRIPCION || raw.puesto || raw.position || 'Sin cargo',
    correo: raw.MAIL_MFEMP,
    sueldo: raw.SLD_MFEDC,
    ubicacion: raw.MTFSUC_DESC,
    ciudad: raw.CIUD_MFEMP,
    celular: raw.TLFCL_MFEMP,
    direccion: raw.DIR_MFEMP
  };
}

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

  // Normalización de la estructura de lista
  const listaRaw = Array.isArray(data) ? data : data?.empleados || data?.data || [];

  // Retorna únicamente objetos con la estructura estandarizada
  return listaRaw.map(mapEmpleado);
}