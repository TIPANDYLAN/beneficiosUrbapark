// src/templates/ConsentimientoAlcoholDrogas.jsx
import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

// Desactivar la división de palabras con guiones
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 35,
    paddingHorizontal: 45,
    fontSize: 9.5,
    fontFamily: 'Times-Roman',
    lineHeight: 1.4,
    color: '#000000',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  logo: {
    width: 120,
    height: 'auto',
  },
  headerMeta: {
    fontSize: 8.5,
    textAlign: 'right',
    lineHeight: 1.3,
  },
  title: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    width: '100%',
    marginBottom: 12,
  },
  paragraph: {
    textAlign: 'justify',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 3,
  },
  bold: {
    fontWeight: 'bold',
  },
  bulletContainer: {
    marginVertical: 3,
    paddingLeft: 8,
  },
  bulletItem: {
    marginBottom: 4,
    textAlign: 'justify',
  },
  signatureSection: {
    marginTop: 25,
    alignItems: 'flex-start',
  },
  signatureSpace: {
    height: 80,
  },
  signatureLine: {
    width: 250,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginBottom: 6,
  },
  signatureText: {
    fontSize: 9.5,
    textAlign: 'left',
    lineHeight: 1.4,
  },
});

export const ConsentimientoAlcoholDrogas = ({ empleado }) => {
  const nombre = empleado?.nombres || empleado?.nombre || '';
  const apellido = empleado?.apellidos || empleado?.apellido || '';
  const cedula = empleado?.cedula || empleado?.numCedula || empleado?.identificacion || '';
  const cargo = empleado?.cargo || empleado?.desCargo || empleado?.nomCargo || 'Colaborador';

  const fechaActual = new Date();
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const dia = fechaActual.getDate();
  const mes = meses[fechaActual.getMonth()];
  const anio = fechaActual.getFullYear();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado con Logo y Versión */}
        <View style={styles.headerRow}>
          <Image src="/logo156.png" style={styles.logo} />
          <View style={styles.headerMeta}>
            <Text style={styles.bold}>VERSIÓN: 00</Text>
            <Text>FECHA DE EMISIÓN: 25/marzo/2026</Text>
          </View>
        </View>

        {/* Título Principal */}
        <Text style={styles.title}>
          CONSENTIMIENTO INFORMADO{'\n'}PRUEBAS DE ALCOHOL (ALCOCHECK) Y DROGAS
        </Text>

        {/* Datos del Trabajador */}
        <Text style={styles.paragraph}>
          Yo, <Text style={styles.bold}>{nombre} {apellido}</Text>, con número de cédula de ciudadanía <Text style={styles.bold}>{cedula}</Text>, en calidad de trabajador(a) de la empresa <Text style={styles.bold}>ESTACIONAMIENTOS URBANOS URBAPARK S.A.</Text>, con el cargo de <Text style={styles.bold}>{cargo}</Text>, manifiesto de manera libre, voluntaria y consciente que, a partir de la presente fecha:
        </Text>

        {/* Cuerpo del texto */}
        <Text style={styles.paragraph}>
          Entiendo que estas pruebas se realizan en cumplimiento de lo establecido en la normativa ecuatoriana aplicable, incluyendo el Art. 11 de la Ley Orgánica de Prevención Integral del Fenómeno Socioeconómico de las Drogas y de Regulación y Control del Uso de Sustancias Catalogadas Sujetas a Fiscalización, el Acuerdo Interministerial N. MDT-MSP-2019-038 (Programa preventivo del uso y consumo de alcohol, tabaco u otras drogas en el ámbito laboral) y los sistemas de gestión implementados por la empresa en Seguridad y Salud en el Trabajo (ISO 45001:2018).
        </Text>

        <Text style={styles.paragraph}>
          Autorizo expresamente a la empresa <Text style={styles.bold}>ESTACIONAMIENTOS URBANOS URBAPARK S.A.</Text> para que se me incluya en la realización de pruebas de detección de alcohol y drogas en mi organismo. Estas podrán efectuarse al inicio de la relación laboral, durante el proceso de selección, de manera aleatoria o de forma direccionada en cualquier momento de la relación laboral, especialmente cuando existan indicios y/o sospechas razonables que puedan comprometer mi seguridad, la de mis compañeros, clientes o los bienes a cargo de la compañía.
        </Text>

        {/* Sección Protección de Datos Personales */}
        <Text style={styles.sectionTitle}>Protección de Datos Personales:</Text>

        <View style={styles.bulletContainer}>
          <Text style={styles.bulletItem}>
            • Reconozco que los resultados de estas pruebas constituyen datos sensibles en el marco de la Ley Orgánica de Protección de Datos Personales (LOPDP).
          </Text>
          <Text style={styles.bulletItem}>
            • Autorizo a la empresa a recolectar, almacenar y tratar dicha información únicamente con fines relacionados con la seguridad laboral, la prevención de riesgos y el cumplimiento de obligaciones legales y contractuales, garantizando la confidencialidad, integridad y seguridad de los datos.
          </Text>
          <Text style={styles.bulletItem}>
            • Autorizo, además, que los resultados puedan ser conocidos y utilizados únicamente por profesionales médicos de la empresa o por las autoridades legales y laborales competentes, cuando sea requerido conforme a derecho.
          </Text>
          <Text style={styles.bulletItem}>
            • He sido informado(a) de que en todo momento conservo mis derechos de acceso, rectificación, actualización, oposición, eliminación y portabilidad de mis datos personales conforme a la ley.
          </Text>
          <Text style={styles.bulletItem}>
            • He sido informado(a) de que la negativa a someterme a estas pruebas o la detección positiva de sustancias prohibidas podrá generar la aplicación de medidas disciplinarias conforme a la normativa laboral vigente, el Código de Trabajo, el Reglamento Interno de la empresa y el Reglamento de Seguridad y Salud en el Trabajo.
          </Text>
        </View>

        {/* Cierre y fecha */}
        <Text style={{ ...styles.paragraph, marginTop: 4 }}>
          En constancia, firmo el presente consentimiento en la ciudad de Quito, a los <Text style={styles.bold}>___________</Text> días del mes de <Text style={styles.bold}>______________________</Text> del año <Text style={styles.bold}>________________</Text>.
        </Text>

        {/* Firma del Trabajador */}
        <View style={styles.signatureSection}>
          <Text style={styles.bold}>Firma del trabajador:</Text>
          <View style={styles.signatureSpace} />
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>
            <Text style={styles.bold}>Nombre completo: </Text>
            <Text style={styles.bold}>{nombre} {apellido}</Text>
            {'\n'}
            <Text style={styles.bold}>Cédula: </Text>
            <Text style={styles.bold}>{cedula}</Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ConsentimientoAlcoholDrogas;