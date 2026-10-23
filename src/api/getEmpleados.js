function mapEmpleado(raw) {
  if (!raw) return {};

  return {
    codMfcia: raw.COD_MFCIA,
    cedula: raw.DOCI_MFEMP || raw.documento || raw.identificacion || '',
    nombre: raw.NOMBRES || raw.nombres || raw.full_name || 'Sin nombre',
    apellido: raw.APELLIDOS || raw.apellidos || '',
    cargo: raw.CAR_DESCRIPCION || raw.puesto || raw.position || 'Sin cargo',
    correo: raw.MAIL_MFEMP || raw.correo || raw.email || '',
    sueldo: raw.SLD_MFEDC || raw.sueldo || 0,
    ubicacion: raw.MTFSUC_DESC || raw.ubicacion || '',
    ciudad: raw.CIUD_MFEMP || raw.ciudad || '',
    provincia: raw.DSC_MFPVC || raw.provincia || '',
    celular: raw.TLFCL_MFEMP || raw.celular || raw.telefono || '',
    direccion: raw.DIR_MFEMP || raw.direccion || '',
    ingreso: raw.FECING_MFEDC || '',
    centroCosto: raw.DSC_MFCC || '',
    codCosto: raw.COD_MFCC || ''
  };
}

export async function obtenerEmpleados() {
  const response = await fetch('/api/empleados', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`La consulta falló con estado ${response.status}`);
  }

  const data = await response.json();

  // Normaliza la estructura de la respuesta.
  const listaRaw = Array.isArray(data)
    ? data
    : data?.empleados || data?.data || [];

  // Mapeo directo ultra veloz (Ya viene filtrado por SQL)
  return listaRaw.map(mapEmpleado);
}