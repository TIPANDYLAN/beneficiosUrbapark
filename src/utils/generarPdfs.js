// src/utils/generarPdfs.js
import { pdf } from '@react-pdf/renderer';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import AutorizacionSeguroMedico from '../templates/autorizacionDescuentoSeguroMedico';
import CartaAcumulacionSueldos from '../templates/cartaAcumulacionSueldos';
import ConsentimientoMediosElectronicos from '../templates/consentimientoMediosElectronicos';
import DeclaracionDatosBiometricos from '../templates/declaracionDatosBiometricos';
import ActaReglamentoInterno from '../templates/actaReglamentoInterno';
import ConsentimientoAlcoholDrogas from '../templates/consentimientoAlcoholDrogas';
import DeclaracionConsentimientoSSO from '../templates/declaracionConsentimientoSSO';

export async function generarPaquetePdfs(objetoEmpleado, onProgress) {
  const zipMaster = new JSZip();

  const listaDocumentos = [
    {
        nombreArchivo: '3.Autorizacion del Descuento de Seguro Médico.pdf',
        componente: <AutorizacionSeguroMedico empleado={objetoEmpleado} />,
    },
    {
        nombreArchivo: '4.Carta Acumulacion 13er y 14to Sueldos.pdf',
        componente: <CartaAcumulacionSueldos empleado={objetoEmpleado} />,
    },
    {
        nombreArchivo: '5.Formato de Consentimiento Informado para Uso de Medios Electrónicos.pdf',
        componente: <ConsentimientoMediosElectronicos empleado={objetoEmpleado} />,
    },
    {
        nombreArchivo: '6.Declaración de Consentimiento para Tratamiento de Datos Personales Biometricos.pdf',
        componente: <DeclaracionDatosBiometricos empleado={objetoEmpleado} />,
    },
    {
        nombreArchivo: '7.Acta de Recepción y Aceptación del Reglamento Interno del Trabajo.pdf',
        componente: <ActaReglamentoInterno empleado={objetoEmpleado} />,
    },{
        nombreArchivo: '8.Consentimiento Alcohol y Drogas.pdf',
        componente: <ConsentimientoAlcoholDrogas empleado={objetoEmpleado} />,
    },{
        nombreArchivo: '11.Declaracion_Consentimiento_SSO.pdf',
        componente: <DeclaracionConsentimientoSSO empleado={objetoEmpleado} />,
    }
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