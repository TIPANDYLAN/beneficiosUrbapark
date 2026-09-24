// src/templates/AutorizacionSeguroMedico.jsx
import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

// Evita la división de palabras con guiones; si no cabe completa, pasa a la siguiente fila
Font.registerHyphenationCallback((word) => [word]);



const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50,
    fontSize: 11,
    fontFamily: 'Times-Roman',
    lineHeight: 1.6,
    color: '#000000',
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  logo: {
    width: 130,
    height: 'auto',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    width: '100%',
    marginBottom: 20,
  },
  paragraph: {
    textAlign: 'justify',
    marginBottom: 14,
  },
  bold: {
    fontWeight: 'bold',
  },
  bulletContainer: {
    marginVertical: 10,
    paddingLeft: 15,
  },
  signatureSection: {
    marginTop: 60,
    alignItems: 'flex-start',
  },
  signatureLine: {
    width: 250,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginBottom: 8,
  },
  signatureText: {
    fontSize: 10,
    textAlign: 'left',
    lineHeight: 1.4,
  },
});

export const AutorizacionSeguroMedico = ({ empleado, fechaEmision }) => {
  const nombre = empleado?.nombres || empleado?.nombre || '';
  const apellido = empleado?.apellidos || empleado?.apellido || '';
  const cedula = empleado?.cedula || empleado?.numCedula || empleado?.identificacion || '';
  const cargo = empleado?.cargo || empleado?.desCargo || empleado?.nomCargo || 'Colaborador';


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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo alineado a la izquierda */}
        <View style={styles.logoContainer}>
          <Image src="/logo156.png" style={styles.logo} />
        </View>

        {/* Título centrado a lo ancho de la página */}
        <Text style={styles.title}>
          AUTORIZACIÓN POR SEGURO MÉDICO PRIVADO
        </Text>

        <Text style={styles.paragraph}>
          Yo, <Text style={styles.bold}>{nombre} {apellido}</Text>, portador/a de la cédula de ciudadanía No. <Text style={styles.bold}>{cedula}</Text>, colaborador/a de la empresa ESTACIONAMIENTOS URBANOS URBAPARK SA en funciones de <Text style={styles.bold}>{cargo}</Text>, por medio de la presente, autorizo de manera voluntaria, libre y expresa a que se realice un descuento mensual desde mi rol de pagos, correspondiente al valor parcial del seguro médico privado contratado por la empresa con el proveedor HUMANA, conforme al siguiente detalle:
        </Text>

        <View style={styles.bulletContainer}>
          <Text style={styles.bold}>
            • Valor mensual a descontar desde rol de pagos: $8,50
          </Text>
        </View>

        <Text style={styles.paragraph}>
          Declaro mi conformidad con el beneficio otorgado y certifico que he sido debidamente informado/a sobre las condiciones, cobertura, costos y beneficios del seguro médico. Asimismo, manifiesto que el descuento correspondiente no afecta mi Salario Básico Unificado. En caso de desvinculación laboral, autorizo de manera expresa que los valores pendientes sean descontados de mi liquidación de haberes.
        </Text>

        <Text style={styles.paragraph}>
          En constancia de conformidad, firmo la presente en Quito, a los {dia} días del mes de {mes} de {anio}.
        </Text>

        <View style={styles.signatureSection}>
          <Text style={{ marginBottom: 40, fontWeight: 'bold' }}>
            Firma del colaborador/a
          </Text>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>
            <Text style={styles.bold}>Nombre completo: </Text>
            <Text style={styles.bold}>{nombre} {apellido}</Text>
            {'\n'}
            <Text style={styles.bold}>Cédula de identidad: </Text>
            <Text style={styles.bold}>{cedula}</Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default AutorizacionSeguroMedico;