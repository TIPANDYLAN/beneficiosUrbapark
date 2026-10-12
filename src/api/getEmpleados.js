const cleanStr = (val, fallback = '') => {
  if (val === null || val === undefined) return fallback;

  const cleaned = String(val).replace(/\s+/g, ' ').trim();

  return cleaned || fallback;
};

function mapEmpleado(raw) {
  if (!raw) return {};

  return {
    codMfcia: raw.COD_MFCIA,
    cedula: cleanStr(raw.DOCI_MFEMP || raw.documento || raw.identificacion),
    nombre: cleanStr(raw.NOMBRES || raw.nombres || raw.full_name,'Sin nombre'),
    apellido: cleanStr(raw.APELLIDOS || raw.apellidos),
    cargo: cleanStr(raw.CAR_DESCRIPCION || raw.puesto || raw.position,'Sin cargo'),
    correo: cleanStr(raw.MAIL_MFEMP || raw.correo || raw.email),
    sueldo: raw.SLD_MFEDC || raw.sueldo || 0,
    ubicacion: cleanStr(raw.MTFSUC_DESC || raw.ubicacion),
    ciudad: cleanStr(raw.CIUD_MFEMP || raw.ciudad),
    provincia: cleanStr(raw.DSC_MFPVC || raw.provincia),
    celular: cleanStr(raw.TLFCL_MFEMP || raw.celular || raw.telefono),
    direccion: cleanStr(raw.DIR_MFEMP || raw.direccion),
    ingreso: cleanStr(raw.FECING_MFEDC),
    centroCosto: cleanStr(raw.DSC_MFCC),
    codCosto: cleanStr(raw.COD_MFCC)
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
      data?.message ||
      `La consulta falló con estado ${response.status}`
    );
  }

  // Normaliza la estructura de la respuesta.
  const listaRaw = Array.isArray(data)
    ? data
    : data?.empleados || data?.data || [];

  // Conserva únicamente los empleados de la compañía 1.
  return listaRaw
    .filter(
      (empleado) =>
        empleado &&
        Number(empleado.COD_MFCIA) === 1
    )
    .map(mapEmpleado);
}