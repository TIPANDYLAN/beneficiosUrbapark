// src/templates/CartaAcumulacionSueldos.jsx
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
    marginBottom: 20,
  },
  logo: {
    width: 130,
    height: 'auto',
  },
  dateText: {
    width: '100%',
    textAlign: 'right',
    marginBottom: 20,
  },
  recipientSection: {
    marginBottom: 20,
    lineHeight: 1.4,
  },
  paragraph: {
    textAlign: 'justify',
    marginBottom: 25,
  },
  bold: {
    fontWeight: 'bold',
  },
  signatureSection: {
    marginTop: 50,
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
    lineHeight: 1.5,
  },
});

export const CartaAcumulacionSueldos = ({ empleado }) => {
  const nombre = empleado?.nombres || empleado?.nombre || '';
  const apellido = empleado?.apellidos || empleado?.apellido || '';
  const cedula = empleado?.cedula || empleado?.numCedula || empleado?.identificacion || '';

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

        {/* Encabezado con fecha */}
        <Text style={styles.dateText}>
          Quito, {dia} de {mes} de {anio}
        </Text>

        {/* Destinatario */}
        <View style={styles.recipientSection}>
          <Text style={styles.bold}>Señores</Text>
          <Text style={styles.bold}>Urbapark S.A.</Text>
          <Text style={styles.bold}>Recursos Humanos</Text>
          <Text>Presente.-</Text>
        </View>

        <Text style={{ marginBottom: 15 }}>Estimados</Text>

        {/* Cuerpo del documento */}
        <Text style={styles.paragraph}>
          Por medio de la presente cumpliendo con lo establecido en la Ley de Justicia Laboral y en el Acuerdo Ministerial Nro. 0087 del Ministerio de Trabajo solicito recibir de manera acumulada los valores correspondientes al décimo tercer y décimo cuarto sueldo.
        </Text>

        <Text style={{ marginBottom: 40 }}>Atentamente,</Text>

        {/* Sección de Firma */}
        <View style={styles.signatureSection}>
          <Text style={{ marginBottom: 40, fontWeight: 'bold' }}>
            Firma:
          </Text>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>
            <Text style={styles.bold}>Nombre: </Text>
            <Text style={styles.bold}>{nombre} {apellido}</Text>
            {'\n'}
            <Text style={styles.bold}>CC. </Text>
            <Text style={styles.bold}>{cedula}</Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default CartaAcumulacionSueldos;