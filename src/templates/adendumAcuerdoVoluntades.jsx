// src/templates/AdendumAcuerdoVoluntades.jsx
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

export const AdendumAcuerdoVoluntades = ({ empleado, fechaEmision }) => {
  const nombre = empleado?.nombres || empleado?.nombre || '';
  const apellido = empleado?.apellidos || empleado?.apellido || '';
  const cedula = empleado?.cedula || empleado?.numCedula || empleado?.identificacion || '';
  const cargo = empleado?.cargo || empleado?.desCargo || empleado?.nomCargo || 'Colaborador';
  const fechaIngreso = empleado?.fechaIngreso || empleado?.fechaContratacion || '';


  const obtenerPartesFecha = (fechaStr) => {
    if (!fechaStr) return { dia: '', mes: '', anio: '' };

    const [year, month, day] = fechaStr.split('-');
    const fechaObj = new Date(year, month - 1, day);

    return {
      dia: fechaObj.getDate(),
      mes: fechaObj.toLocaleDateString('es-EC', { month: 'long' }),
      anio: fechaObj.getFullYear(),
    };
  };

  const { dia, mes, anio } = obtenerPartesFecha(fechaEmision);

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
          ADENDUM Y ACUERDO DE VOLUNTADES (CONSENTIMIENTO)
        </Text>

        {/* Comparecientes */}
        <Text style={styles.paragraph}>
          En la ciudad de Quito, a los <Text style={styles.bold}>{dia}</Text> días del mes de <Text style={styles.bold}>{mes}</Text> del <Text style={styles.bold}>{anio}</Text>, comparecen por una parte la compañía ESTACIONAMIENTOS URBANOS URBAPARK S.A., representada por BURBANO DE LARA CORREA PABLO ENRIQUE, en su calidad de Gerente General y, a quien en adelante se le denominará <Text style={styles.italic}>"EMPLEADOR"</Text>; y, por otra parte, el señor <Text style={styles.bold}>{nombre} {apellido}</Text>, con cédula de ciudadanía Nro. <Text style={styles.bold}>{cedula}</Text> en adelante <Text style={styles.italic}>"TRABAJADOR"</Text>, el presente acuerdo transaccional lo suscriben de mutuo acuerdo con el fin de establecer la compensación de horas laborales.
        </Text>

        {/* Cláusula Primera */}
        <Text style={styles.sectionTitle}>CLÁUSULA PRIMERA: ANTECEDENTES. -</Text>
        <Text style={styles.paragraph}>
          Con fecha <Text style={styles.bold}>{fechaTextoContratacion}</Text> el EMPLEADOR contrató los servicios del TRABAJADOR, quien actualmente se encuentra desempeñando el cargo de <Text style={styles.bold}>{cargo}</Text>.
        </Text>
        <Text style={styles.paragraph}>
          En función de las nuevas normas legales emitidas por el Ministerio de Trabajo que regulan la jornada de trabajo, es necesario ajustar el contrato de trabajo suscrito entre los comparecientes.
        </Text>
        <Text style={styles.paragraph}>
          Los comparecientes acuerdan libre y voluntariamente, suscribir el presente acuerdo transaccional para la compensación de horas laborales.
        </Text>

        {/* Cláusula Segunda */}
        <Text style={styles.sectionTitle}>CLÁUSULA SEGUNDA: ADENDUM Y ACUERDO DE VOLUNTADES. –</Text>
        <Text style={styles.paragraph}>
          Con los antecedentes expuestos, los comparecientes modifican el contrato de trabajo y acuerdan de manera libre, voluntaria y expresa en lo siguiente:
        </Text>
        <Text style={styles.paragraph}>
          El TRABAJADOR acepta y faculta al EMPLEADOR a:
        </Text>

        <View style={styles.bulletContainer}>
          <Text style={styles.bulletItem}>
            • Establecer que la jornada laboral ordinaria del presente contrato sea de cuarenta (40) horas semanales, distribuidas en un máximo de seis (6) días a la semana, sin exceder las ocho (8) horas diarias, garantizándose al menos veinticuatro (24) horas consecutivas de descanso semanal.
          </Text>
          <Text style={styles.bulletItem}>
            • Extender o interrumpir la jornada laboral y, en virtud de ello, aplicar mecanismos de compensación y/o recuperación de horas de trabajo, a efectos de completar el número de horas laborales mensuales que el TRABAJADOR debe cumplir conforme a cada mes. Lo anterior será coordinado con los Jefes de Área y Talento Humano.
          </Text>
          <Text style={styles.bulletItem}>
            • Las partes acuerdan que las horas laborales que excedan la jornada diaria ordinaria (no mayor a 12 horas al día) serán compensadas con días adicionales de descanso, conforme lo establezca la planificación interna de la compañía y en coordinación con el Departamento de Talento Humano.
          </Text>
          <Text style={styles.bulletItem}>
            • Los comparecientes acuerdan en que los días de descanso obligatorios y feriados, así como horas adicionales de trabajo puedan ser compensadas con descanso conforme lo establezca la planificación interna de la compañía.
          </Text>
          <Text style={styles.bulletItem}>
            • En caso de que los días de descanso acumulados concedidos al TRABAJADOR superan el número de días de descanso forzoso o de compensación, serán imputables al período de días de vacación anual a que tiene derecho cada trabajador de conformidad con el artículo 69 del Código del Trabajo. Sin perjuicio de que estos días sean remunerados.
          </Text>
          <Text style={styles.bulletItem}>
            • El TRABAJADOR se obliga a cumplir con las jornadas de trabajo que sean dispuestas por el EMPLEADOR en función de la planificación realizada considerando el número de horas que debe cumplir semanal y/o mensualmente de cada mes, en función de las jornadas que sean interrumpidas y aquellas que excedan del horario planificado inicialmente.
          </Text>
        </View>

        {/* Cláusula Cuarta */}
        <Text style={styles.sectionTitle}>CLÁUSULA CUARTA: ACEPTACIÓN Y RATIFICACIÓN. –</Text>
        <Text style={styles.paragraph}>
          Las partes se ratifican en el contenido de las cláusulas precedentes, en razón de todo lo cual en unidad de acto con la autoridad respectiva firman por triplicado en ejemplares del mismo valor y tenor.
        </Text>

        <View style={styles.signaturesContainer}>

          <View style={styles.signatureBox}>
            <View style={styles.signatureSpace} />
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>
              <Text style={styles.bold}>BURBANO DE LARA CORREA PABLO</Text>{'\n'}
              <Text style={styles.bold}>ESTACIONAMIENTOS URBANOS URBAPARK S.A.</Text>{'\n'}
              <Text style={styles.bold}>EMPLEADOR</Text>
            </Text>
          </View>

          <View style={styles.signatureBox}>
            <View style={styles.signatureSpace} />
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>
              <Text style={styles.bold}>Nombres: </Text>{nombre} {apellido}{'\n'}
              <Text style={styles.bold}>Cédula: </Text>{cedula}{'\n'}
              <Text style={styles.bold}>TRABAJADOR</Text>
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default AdendumAcuerdoVoluntades;