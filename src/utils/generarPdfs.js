// src/utils/generarPdfs.js
import { pdf } from '@react-pdf/renderer';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import AutorizacionSeguroMedico from '../templates/autorizacionDescuentoSeguroMedico';
import CartaAcumulacionSueldos from '../templates/cartaAcumulacionSueldos';

export async function generarPaquetePdfs(objetoEmpleado, onProgress) {
  const zipMaster = new JSZip();

  const listaDocumentos = [
    {
      nombreArchivo: '3.Autorizacion_Descuento_Seguro_Medico.pdf',
      componente: <AutorizacionSeguroMedico empleado={objetoEmpleado} />,
    },
    {
    nombreArchivo: '4.Carta_Acumulacion_13er_14to_Sueldos.pdf',
    componente: <CartaAcumulacionSueldos empleado={objetoEmpleado} />,
    },
  ];

  for (let i = 0; i < listaDocumentos.length; i++) {
    const docItem = listaDocumentos[i];

    // Compila el JSX a PDF en formato Blob
    const blobPdf = await pdf(docItem.componente).toBlob();

    // Añade el archivo PDF al paquete ZIP
    zipMaster.file(docItem.nombreArchivo, blobPdf);

    if (onProgress) {
      onProgress(Math.round(((i + 1) / listaDocumentos.length) * 100));
    }
  }

  // Descargar ZIP con la cédula del colaborador como identificador
  const zipBlob = await zipMaster.generateAsync({ type: 'blob' });
  const idEmpleado = objetoEmpleado?.cedula || objetoEmpleado?.numCedula || 'Empleado';
  saveAs(zipBlob, `Documentos_Contratacion_${idEmpleado}.zip`);
}