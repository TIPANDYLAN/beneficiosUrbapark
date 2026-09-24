// src/utils/generarPdfs.js
import React from 'react';
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
import AdendumAcuerdoVoluntades from '../templates/adendumAcuerdoVoluntades';
import ComposicionRemuneracion from '../templates/composicionRemuneracion';

export async function generarPaquetePdfs(objetoEmpleado, idsSeleccionados = [], opciones = { montoBono: 0.00, fechaEmision: '' }, onProgress) {
  const zipMaster = new JSZip();

  // Mapeo de IDs (del componente Contratacion.jsx) con las plantillas y nombres de archivo
  const mapaPlantillas = {
    autorizacionDescuentoSeguro: {
      nombreArchivo: '3.Autorizacion del Descuento de Seguro Médico.pdf',
      componente: <AutorizacionSeguroMedico empleado={objetoEmpleado}
        fechaEmision={opciones?.fechaEmision ?? ''} />,
    },
    cartaAcumulacionSueldos: {
      nombreArchivo: '4.Carta Acumulacion 13er y 14to Sueldos.pdf',
      componente: <CartaAcumulacionSueldos empleado={objetoEmpleado}
        fechaEmision={opciones?.fechaEmision ?? ''} />,
    },
    consentimientoMediosElectronicos: {
      nombreArchivo: '5.Formato de Consentimiento Informado para Uso de Medios Electrónicos.pdf',
      componente: <ConsentimientoMediosElectronicos empleado={objetoEmpleado}
        fechaEmision={opciones?.fechaEmision ?? ''} />,
    },
    declaracionDatosBiometricos: {
      nombreArchivo: '6.Declaración de Consentimiento para Tratamiento de Datos Personales Biometricos.pdf',
      componente: <DeclaracionDatosBiometricos empleado={objetoEmpleado}
        fechaEmision={opciones?.fechaEmision ?? ''} />,
    },
    actaReglamentoInterno: {
      nombreArchivo: '7.Acta de Recepción y Aceptación del Reglamento Interno del Trabajo.pdf',
      componente: <ActaReglamentoInterno empleado={objetoEmpleado}
        fechaEmision={opciones?.fechaEmision ?? ''} />,
    },
    consentimientoAlcoholDrogas: {
      nombreArchivo: '8.Consentimiento Alcohol y Drogas.pdf',
      componente: <ConsentimientoAlcoholDrogas empleado={objetoEmpleado}
        fechaEmision={opciones?.fechaEmision ?? ''} />,
    },
    adendumAcuerdoVoluntades: {
      nombreArchivo: '9.Adendum_y_Acuerdo_de_Voluntades.pdf',
      componente: <AdendumAcuerdoVoluntades empleado={objetoEmpleado}
        fechaEmision={opciones?.fechaEmision ?? ''} />,
    },
    declaracionConsentimientoSSO: {
      nombreArchivo: '11.Declaracion_Consentimiento_SSO.pdf',
      componente: <DeclaracionConsentimientoSSO empleado={objetoEmpleado}
        fechaEmision={opciones?.fechaEmision ?? ''} />,
    },
    composicionRemuneracion: {
      nombreArchivo: '12.Composicion_de_Remuneracion.pdf',
      componente: (
        <ComposicionRemuneracion
          empleado={objetoEmpleado}
          montoBono={opciones?.montoBono ?? 0.00}
          fechaEmision={opciones?.fechaEmision ?? ''}
        />
      ),
    },
  };

  // Filtrar solo los documentos seleccionados mediante los checkboxes
  const documentosAProcesar = idsSeleccionados
    .map((id) => mapaPlantillas[id])
    .filter(Boolean);

  const total = documentosAProcesar.length;
  if (total === 0) return;

  // Procesar uno a uno los PDFs seleccionados y empaquetarlos en el ZIP
  for (let i = 0; i < total; i++) {
    const docItem = documentosAProcesar[i];

    // Compila el JSX a PDF en formato Blob
    const blobPdf = await pdf(docItem.componente).toBlob();

    // Añade el archivo PDF al paquete ZIP
    zipMaster.file(docItem.nombreArchivo, blobPdf);

    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 100));
    }
  }

  // Descargar ZIP final con la cédula del colaborador
  const zipBlob = await zipMaster.generateAsync({ type: 'blob' });
  const idEmpleado = objetoEmpleado?.cedula || objetoEmpleado?.numCedula || 'Empleado';
  saveAs(zipBlob, `Documentos_Contratacion_${idEmpleado}.zip`);
}