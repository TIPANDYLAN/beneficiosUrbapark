// src/templates/DeclaracionConsentimientoSSO.jsx
import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

// Desactivar la división de palabras con guiones
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 40,
    fontSize: 9.5,
    fontFamily: 'Times-Roman',
    lineHeight: 1.35,
    color: '#000000',
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  logo: {
    width: 110,
    height: 'auto',
  },
  title: {
    fontSize: 11.5,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    width: '100%',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 10,
    marginLeft: 15,
    textTransform: 'uppercase',
  },
  paragraph: {
    textAlign: 'justify',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  bulletContainer: {
    marginVertical: 2,
    paddingLeft: 10,
  },
  bulletItem: {
    marginBottom: 3,
    textAlign: 'justify',
  },
  signaturesContainer: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  signatureBox: {
    width: '45%',
  },
  signatureSpace: {
    height: 80,
  },
  signatureLine: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 8.5,
    lineHeight: 1.3,
  },
});

export const DeclaracionConsentimientoSSO = ({ empleado }) => {
  const nombre = empleado?.nombres || empleado?.nombre || '';
  const apellido = empleado?.apellidos || empleado?.apellido || '';
  const cedula = empleado?.cedula || empleado?.numCedula || empleado?.identificacion || '';
  const cargo = empleado?.cargo || empleado?.desCargo || empleado?.nomCargo || 'Colaborador';
  const fechaIngreso = empleado?.fechaIngreso || empleado?.fechaContratacion || '';

  const fechaActual = new Date();
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const dia = fechaActual.getDate();
  const mes = meses[fechaActual.getMonth()];
  const anio = fechaActual.getFullYear();

  const fechaTextoContratacion = fechaIngreso ? fechaIngreso : `${dia} de ${mes} de ${anio}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo corporativo */}
        <View style={styles.logoContainer}>
          <Image src="/logo156.png" style={styles.logo} />
        </View>

        {/* Título Principal */}
        <Text style={styles.title}>
          DECLARACIÓN DE CONSENTIMIENTO PARA TRATAMIENTO DE DATOS PERSONALES EN SEGURIDAD Y SALUD OCUPACIONAL
        </Text>

        {/* Comparecientes */}
        <Text style={styles.paragraph}>
          Comparecen al otorgamiento del presente documento, por una parte el/la señor(a) <Text style={styles.bold}>{nombre} {apellido}</Text> por sus propios y personales derechos, a quien se llamará como <Text style={styles.italic}>TRABAJADOR</Text>; y, por otra parte la compañía <Text style={styles.bold}>ESTACIONAMIENTOS URBANOS URBAPARK S.A.</Text> legalmente representada por BURBANO DE LARA CORREA PABLO ENRIQUE en su calidad de REPRESENTANTE LEGAL, parte a la que se llamará como EMPLEADOR.
        </Text>

        {/* I. Antecedentes */}
        <Text style={styles.sectionTitle}>I. ANTECEDENTES:</Text>
        <Text style={styles.paragraph}>
          Con fecha <Text style={styles.bold}>{fechaTextoContratacion}</Text> el EMPLEADOR contrató los servicios lícitos y personales del señor@ <Text style={styles.bold}>{nombre} {apellido}</Text>, quien actualmente ocupa el cargo de <Text style={styles.bold}>{cargo}</Text>.
        </Text>
        <Text style={styles.paragraph}>
          La Ley de Protección de Datos Personales determina que el tratamiento de datos personales será legítimo y lícito cuando se cuente con el consentimiento del titular para una o varias finalidades específicas.
        </Text>

        {/* II. Consentimiento */}
        <Text style={styles.sectionTitle}>II. CONSENTIMIENTO:</Text>
        <Text style={styles.paragraph}>
          Por el presente documento el señor@ <Text style={styles.bold}>{nombre} {apellido}</Text> de manera libre, voluntaria y expresa da su consentimiento y autorización para que el EMPLEADOR dé el tratamiento de sus datos personales de salud en la relación médico-ocupacionales e interacciones médicas que se generen en razón de la relación laboral que los comparecientes mantienen, incluidos aquellos que obtenidos a través del Formulario de Evaluaciones Médicas Ocupacionales.
        </Text>
        <Text style={styles.paragraph}>
          El consentimiento implica la utilización de los resultados de los exámenes médicos que se realice el TRABAJADOR y que sean dispuestos por el EMPLEADOR a través del área médica, debiendo este último informar al TRABAJADOR con claridad y especificidad del objetivo e información que sea entregada al médico de la compañía. Estos resultados serán utilizados a efectos de elaborar la ficha médica ocupacional, historia clínica y plan de prevención de riesgos de seguridad y salud ocupacional.
        </Text>
        <Text style={styles.paragraph}>
          La solicitud de información, tanto para la elaboración de la historia clínica como los exámenes médicos requeridos se limitará exclusivamente a los riesgos específicos derivado del puesto de trabajo del TRABAJADOR.
        </Text>
        <Text style={styles.paragraph}>
          El TRABAJADOR faculta al EMPLEADOR a remitir su historia clínica al Instituto Ecuatoriano de Seguridad Social (IESS) en caso de producirse un accidente de trabajo y/o enfermedad ocupacional o cualquier otro requerimiento que esta entidad pública realice. Autoriza también a remitir la historia clínica a una entidad de salud privada que lo requiera en caso de una emergencia que requiera de esta información.
        </Text>
        <Text style={styles.paragraph}>
          El TRABAJADOR autoriza a que los resultados de los exámenes médicos que le sean practicados en cumplimiento de la normativa legal aplicable a los empleadores, entre otros exámenes pre ocupacionales, ocupacionales y post ocupacionales, sean entregados al médico, al encargado de salud ocupacional y el responsable de talento humano de la empresa para los fines señalados en este documento.
        </Text>

        {/* III. Declaraciones y Autorizaciones */}
        <Text style={styles.sectionTitle}>III. DECLARACIONES Y AUTORIZACIONES:</Text>
        <Text style={styles.paragraph}>
          3.1 Declaro y certifico que soy mayor de edad, y que los datos personales que proporcione son de mi titularidad, siendo estos verdaderos, exactos, auténticos, completos y correctos.
        </Text>
        <Text style={styles.paragraph}>
          3.2 Declaro que he sido debidamente informado sobre el propósito, uso y tratamiento que se dará a mis datos personales de salud, incluidos aquellos que obtenidos a través del Formulario de Evaluaciones Médicas Ocupacionales, los cuales serán tratados conforme a los principios que constan en la Ley Orgánica de Protección de Datos Personales y su Reglamento.
        </Text>
        <Text style={styles.paragraph}>
          3.3 Reconozco y acredito la existencia de una interacción con un profesional de la salud de la Compañía.
        </Text>
        <Text style={styles.paragraph}>
          3.4 Declaro que es de mi absoluta responsabilidad informar de forma oportuna y veraz cualquier síntoma, condición médica o cambio relevante sobre mi estado de salud que pueda tener implicaciones en el ámbito laboral.
        </Text>
        <Text style={styles.paragraph}>
          3.5 Autorizo expresamente a la Compañía <Text style={styles.bold}>ESTACIONAMIENTOS URBANOS URBAPARK S.A.</Text>, al médico ocupacional y al departamento de talento humano a proporcionar la información relacionada con mi salud en las siguientes circunstancias:
        </Text>

        <View style={styles.bulletContainer}>
          <Text style={styles.bulletItem}>
            a) Para llevar a cabo el seguimiento y cuidado necesarios en el marco de mi contrato laboral, es decir, cuidar de mi salud y enmarcar mi condición al puesto de trabajo y funciones a ser desempeñadas.
          </Text>
          <Text style={styles.bulletItem}>
            b) En caso de que las instituciones públicas, como el Ministerio de Salud Pública, el Instituto Ecuatoriano de Seguridad Social y Riesgos de Trabajo, así lo soliciten.
          </Text>
          <Text style={styles.bulletItem}>
            c) Para entregar la información relacionada con mi salud al Instituto Ecuatoriano de Seguridad Social y Riesgos de Trabajo en caso de sufrir un accidente de trabajo o enfermedad profesional.
          </Text>
        </View>

        <Text style={styles.paragraph}>
          3.6 Autorizo expresamente a la Compañía <Text style={styles.bold}>ESTACIONAMIENTOS URBANOS URBAPARK S.A.</Text> para que a través del médico ocupacional trate mis datos personales de salud durante el tiempo que dure la relación laboral y cuatro (4) años finalizada la misma.
        </Text>

        {/* Fecha y Cierre */}
        <Text style={{ ...styles.paragraph, marginTop: 4 }}>
          Para constancia de lo expuesto suscribimos en 2 ejemplares de igual tenor y valor en la ciudad de Quito, a los <Text style={styles.bold}>{dia}</Text> días del mes de <Text style={styles.bold}>{mes}</Text> del año <Text style={styles.bold}>{anio}</Text>.
        </Text>

        {/* Sección de Firmas en 2 Columnas Alineadas */}
        <View style={styles.signaturesContainer}>
          {/* Firma Empleador */}
          <View style={styles.signatureBox}>
            <View style={styles.signatureSpace} />
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>
              <Text style={styles.bold}>ESTACIONAMIENTOS URBANOS URBAPARK S.A.</Text>{'\n'}
              <Text style={styles.bold}>Burbano De Lara Correa Pablo Enrique</Text>{'\n'}
              Representante Legal{'\n'}
              <Text style={styles.bold}>EMPLEADOR</Text>
            </Text>
          </View>

          {/* Firma Trabajador */}
          <View style={styles.signatureBox}>
            <View style={styles.signatureSpace} />
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>
              (FIRMA DEL TRABAJADOR){'\n'}
              <Text style={styles.bold}>Nombre: </Text>{nombre} {apellido}{'\n'}
              <Text style={styles.bold}>CC: </Text>{cedula}{'\n'}
              <Text style={styles.bold}>TRABAJADOR</Text>
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default DeclaracionConsentimientoSSO;