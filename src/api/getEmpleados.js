const cleanStr = (value, fallback = '') =>
  String(value ?? '').replace(/\s+/g, ' ').trim() || fallback;

function mapEmpleado(raw) {
  const nombre = cleanStr(raw.NOMBRES || raw.nombres || raw.nombre);
  const apellido = cleanStr(raw.APELLIDOS || raw.apellidos || raw.apellido);
  const nombreCompleto = cleanStr(raw.nombreCompleto || raw.full_name || `${nombre} ${apellido}`, 'Sin nombre');
  return {
    ...raw,
    codMfcia: raw.COD_MFCIA ?? raw.codMfcia,
    cedula: cleanStr(raw.DOCI_MFEMP || raw.documento || raw.identificacion || raw.cedula || raw.dni),
    nombre: nombre || nombreCompleto,
    apellido,
    nombreCompleto,
    cargo: cleanStr(raw.CAR_DESCRIPCION || raw.puesto || raw.position || raw.cargo),
    correo: cleanStr(raw.MAIL_MFEMP || raw.correo || raw.email),
    sueldo: raw.SLD_MFEDC ?? raw.sueldo ?? 0,
    ubicacion: cleanStr(raw.MTFSUC_DESC || raw.ubicacion),
    ciudad: cleanStr(raw.CIUD_MFEMP || raw.ciudad),
    provincia: cleanStr(raw.DSC_MFPVC || raw.provincia),
    celular: cleanStr(raw.TLFCL_MFEMP || raw.celular || raw.telefono),
    direccion: cleanStr(raw.DIR_MFEMP || raw.direccion),
    ingreso: cleanStr(raw.FECING_MFEDC || raw.ingreso || raw.fechaContratacion),
    centroCosto: cleanStr(raw.DSC_MFCC || raw.centroCosto),
    codCosto: cleanStr(raw.COD_MFCC || raw.codCosto),
  };
}

export async function obtenerEmpleados() {
  const response = await fetch('/api/empleados', { method: 'GET' });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('El servicio de empleados devolvió una respuesta inválida.');
  }
  if (!response.ok) {
    throw new Error(data?.message || `La consulta de empleados falló con estado ${response.status}`);
  }
  const rows = Array.isArray(data) ? data : data?.empleados ?? data?.data;
  if (!Array.isArray(rows)) {
    throw new Error('El servicio de n8n no devolvió una lista de empleados.');
  }
  return rows.map(row => row?.json ?? row)
    .filter(row => row && typeof row === 'object' &&
      (row.COD_MFCIA == null || Number(row.COD_MFCIA) === 1))
    .map(mapEmpleado);
}
