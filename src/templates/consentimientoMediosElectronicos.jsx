// src/templates/ConsentimientoMediosElectronicos.jsx
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
  infoSection: {
    marginBottom: 10,
    lineHeight: 1.0,
  },
  paragraph: {
    textAlign: 'justify',
    marginBottom: 12,
  },
  bold: {
    fontWeight: 'bold',
  },
  bulletContainer: {
    marginVertical: 8,
    paddingLeft: 15,
  },
  bulletItem: {
    marginBottom: 1,
  },
  fieldRow: {
    marginVertical: 6,
  },
  signatureSection: {
    marginTop: 40,
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

export const ConsentimientoMediosElectronicos = ({ empleado }) => {
  const nombre = empleado?.nombres || empleado?.nombre || '';
  const apellido = empleado?.apellidos || empleado?.apellido || '';
  const cedula = empleado?.cedula || empleado?.numCedula || empleado?.identificacion || '';
  const correo = empleado?.correo || empleado?.email || empleado?.correoElectronico || '';

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
        {/* Logo de la empresa */}
        <View style={styles.logoContainer}>
          <Image src="/logo156.png" style={styles.logo} />
        </View>

        {/* Título centrado */}
        <Text style={styles.title}>
          FORMATO DE CONSENTIMIENTO INFORMADO PARA USO DE MEDIOS ELECTRÓNICOS
        </Text>

        {/* Datos de Empresa y Objeto */}
        <View style={styles.infoSection}>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>EMPRESA: ESTACIONAMIENTOS URBANOS URBAPARK S.A. </Text>
           
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>OBJETO: </Text>
            Autorización del trabajador para el uso de medios electrónicos como canal oficial para el envío de documentos laborales, incluyendo roles de pago.
          </Text>
        </View>

        {/* Cuerpo principal */}
        <Text style={styles.paragraph}>
          Yo, <Text style={styles.bold}>{nombre} {apellido}</Text>, portador/a de la cédula de ciudadanía No. <Text style={styles.bold}>{cedula}</Text>, en mi calidad de trabajador/a de <Text style={styles.bold}>ESTACIONAMIENTOS URBANOS URBAPARK S.A.</Text>, autorizo de forma expresa, voluntaria e irrevocable a la empresa a utilizar mi correo electrónico (institucional o personal autorizado) para el envío y recepción de documentos laborales, incluyendo, pero no limitándose a:
        </Text>

        {/* Lista con viñetas */}
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletItem}>• Rol individual de pagos mensuales.</Text>
          <Text style={styles.bulletItem}>• Comunicaciones oficiales.</Text>
          <Text style={styles.bulletItem}>• Circulares informativas.</Text>
          <Text style={styles.bulletItem}>• Notificaciones y reglamentos internos.</Text>
        </View>

        <Text style={styles.paragraph}>
          Declaro haber sido informado/a que el envío de dicha información se enmarca en lo establecido por la <Text style={styles.bold}>Ley de Comercio Electrónico, Firmas Electrónicas y Mensajes de Datos (Ley No. 67, Registro Oficial Suplemento 735, de abril de 2002)</Text>, que otorga plena validez legal a los mensajes de datos y comunicaciones electrónicas en el ámbito laboral.
        </Text>

        <Text style={styles.paragraph}>
          Así mismo, reconozco que el correo electrónico designado será el medio oficial de notificación, y me comprometo a revisar periódicamente el mismo, informando cualquier cambio de dirección electrónica a Talento Humano.
        </Text>

        {/* Campos de Correo y Fecha */}
        <View style={{ marginTop: 15, marginBottom: 20 }}>
          <Text style={styles.fieldRow}>
            <Text style={styles.bold}>Correo electrónico autorizado: </Text>
            <Text style={styles.bold}>{correo}</Text>
          </Text>
          <Text style={styles.fieldRow}>
            <Text style={styles.bold}>Lugar y Fecha: </Text>
            Quito, {dia} de {mes} de {anio}
          </Text>
        </View>

        {/* Sección de Firma */}
        <View style={styles.signatureSection}>
          <Text style={{ marginBottom: 40, fontWeight: 'bold' }}>
            Firma del Trabajador:
          </Text>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>
            <Text style={styles.bold}>Nombre Completo: </Text>
            <Text style={styles.bold}>{nombre} {apellido}</Text>
            {'\n'}
            <Text style={styles.bold}>Cédula de ciudadanía: </Text>
            <Text style={styles.bold}>{cedula}</Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ConsentimientoMediosElectronicos;