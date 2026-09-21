// src/templates/ActaReglamentoInterno.jsx
import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

// Desactivar la división de palabras con guiones
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
    marginBottom: 15,
  },
  logo: {
    width: 130,
    height: 'auto',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    width: '100%',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
  paragraph: {
    textAlign: 'justify',
    marginBottom: 12,
  },
  bold: {
    fontWeight: 'bold',
  },
  detailsBox: {
    marginVertical: 10,
    paddingLeft: 10,
    lineHeight: 1.6,
  },
  bulletContainer: {
    marginVertical: 10,
    paddingLeft: 10,
  },
  bulletItem: {
    marginBottom: 8,
    textAlign: 'justify',
  },
  signatureSection: {
    marginTop: 45,
    alignItems: 'flex-start',
  },
  signatureSpace: {
    height: 80,
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
    lineHeight: 1.5,
  },
});

export const ActaReglamentoInterno = ({ empleado }) => {
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
        {/* Logo corporativo */}
        <View style={styles.logoContainer}>
          <Image src="/logo156.png" style={styles.logo} />
        </View>

        {/* Título y Subtítulo */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            ACTA DE RECEPCIÓN Y ACEPTACIÓN DEL REGLAMENTO INTERNO DE TRABAJO
          </Text>
          <Text style={styles.subtitle}>URBAPARK S.A.</Text>
        </View>

        {/* Fecha y Comparecencia */}
        <Text style={styles.paragraph}>
          En la ciudad de Quito, a los <Text style={styles.bold}>{dia}</Text> días del mes de <Text style={styles.bold}>{mes}</Text> del año <Text style={styles.bold}>{anio}</Text>, comparece el/la trabajador/a cuyos datos se detallan a continuación:
        </Text>

        {/* Detalle del Trabajador */}
        <View style={styles.detailsBox}>
          <Text style={styles.detailRow}>
            <Text style={styles.bold}>Nombres y Apellidos: </Text>
            <Text style={styles.bold}>{nombre} {apellido}</Text>
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.bold}>Cédula de Identidad: </Text>
            <Text style={styles.bold}>{cedula}</Text>
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.bold}>Cargo: </Text>
            <Text style={styles.bold}>{cargo}</Text>
          </Text>
        </View>

        {/* Introducción de Compromisos */}
        <Text style={styles.paragraph}>
          En virtud de la normativa laboral vigente y en cumplimiento de las disposiciones del Código de Trabajo y del Reglamento Interno de Trabajo de <Text style={styles.bold}>URBAPARK S.A.</Text>, el/la trabajador/a:
        </Text>

        {/* Puntos de Compromiso */}
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletItem}>
            • Declara haber recibido en esta fecha un ejemplar del Reglamento Interno de Trabajo de URBAPARK S.A., comprometiéndose a su lectura y comprensión.
          </Text>
          <Text style={styles.bulletItem}>
            • Se obliga a cumplir con todas las disposiciones, normas y políticas internas establecidas en el reglamento, así como las que se emitan posteriormente en materia laboral, disciplinaria y administrativa.
          </Text>
          <Text style={styles.bulletItem}>
            • Manifiesta conocer que el incumplimiento de las normas podrá ser objeto de sanciones conforme a la legislación laboral vigente y las políticas internas de la empresa.
          </Text>
          <Text style={styles.bulletItem}>
            • Acepta cumplir fielmente con sus deberes, mantener la confidencialidad sobre la información institucional y contribuir al cumplimiento de los objetivos y valores de la organización.
          </Text>
        </View>

        {/* Declaración final */}
        <Text style={styles.paragraph}>
          En señal de conformidad, firma la presente acta dejando constancia de su aceptación y compromiso.
        </Text>

        {/* Sección de Firma */}
        <View style={styles.signatureSection}>
          <Text style={{ fontWeight: 'bold' }}>
            Firma del Trabajador/a:
          </Text>
          <View style={styles.signatureSpace} />
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>
            <Text style={styles.bold}>Nombre del Trabajador/a: </Text>
            <Text style={styles.bold}>{nombre} {apellido}</Text>
            {'\n'}
            <Text style={styles.bold}>C.C.: </Text>
            <Text style={styles.bold}>{cedula}</Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ActaReglamentoInterno;