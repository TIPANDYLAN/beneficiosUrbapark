// src/api/getEmpleados.js

// Mappeador: Define la equivalencia entre la API externa y tu modelo interno
// Helper para sanitizar y limpiar cadenas de texto
const cleanStr = (val, fallback = '') => {
  if (val === null || val === undefined) return fallback;
  const cleaned = String(val).replace(/\s+/g, ' ').trim();
  return cleaned || fallback;
};

function mapEmpleado(raw) {
  if (!raw) return {};

  return {
    cedula: cleanStr(raw.DOCI_MFEMP || raw.documento || raw.identificacion),
    nombre: cleanStr(raw.NOMBRES || raw.nombres || raw.full_name, 'Sin nombre'),
    apellido: cleanStr(raw.APELLIDOS || raw.apellidos),
    cargo: cleanStr(raw.CAR_DESCRIPCION || raw.puesto || raw.position, 'Sin cargo'),
    correo: cleanStr(raw.MAIL_MFEMP || raw.correo || raw.email),
    sueldo: raw.SLD_MFEDC || raw.sueldo || 0,
    ubicacion: cleanStr(raw.MTFSUC_DESC || raw.ubicacion),
    ciudad: cleanStr(raw.CIUD_MFEMP || raw.ciudad),
    provincia: cleanStr(raw.DSC_MFPVC || raw.provincia),
    celular: cleanStr(raw.TLFCL_MFEMP || raw.celular || raw.telefono),
    direccion: cleanStr(raw.DIR_MFEMP || raw.direccion)
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