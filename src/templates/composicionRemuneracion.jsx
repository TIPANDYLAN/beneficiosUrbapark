// src/templates/composicionRemuneracion.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

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
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    width: '100%',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    marginTop: 4,
  },
  paragraph: {
    textAlign: 'justify',
    marginBottom: 12,
  },
  bold: {
    fontFamily: 'Times-Bold',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  signatureSpace: {
    height: 120,
  },
  signatureLine: {
    width: 200,
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

export default function ComposicionRemuneracion({ empleado, montoBono }) {
  const nombreEmpleado = `${empleado?.nombre || empleado?.nombres || ''} ${
    empleado?.apellido || empleado?.apellidos || ''
  }`.trim();

  const cedula = empleado?.cedula || empleado?.numCedula || empleado?.identificacion || '';
  const sueldo = empleado?.sueldo + '.00' || '0.00';

  const fechaActual = new Date().toLocaleDateString('es-EC', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.logoContainer}>
          <Image src="/logo156.png" style={styles.logo} />
        </View>

        <Text style={[styles.paragraph, { textAlign: 'right', marginBottom: 20 }]}>
          Quito, {fechaActual}
        </Text>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>COMPOSICIÓN DE REMUNERACIÓN</Text>
        </View>

        <Text style={styles.paragraph}>
          Por medio del presente documento, <Text style={styles.bold}>URBAPARK S.A.</Text>, deja constancia formal de las condiciones de remuneración acordadas para el/la colaborador(a):
        </Text>

        <View style={styles.detailsBox}>
          <Text>
            <Text style={styles.bold}>Nombre del colaborador(a): </Text>
            {nombreEmpleado}
          </Text>
          <Text>
            <Text style={styles.bold}>Cédula / Identificación: </Text>
            {cedula}
          </Text>
        </View>

        <Text style={styles.paragraph}>
          Se establece que el/la colaborador(a) recibirá una remuneración mensual fija de <Text style={styles.bold}>USD {sueldo}</Text>.
        </Text>

        <Text style={styles.paragraph}>
          Adicionalmente, se asignará un bono por concepto de <Text style={styles.bold}>“Alimentación”</Text>, el cual no es aportable y será registrado en el rol de pagos correspondiente, por un valor mensual de <Text style={styles.bold}>USD {Number(montoBono).toFixed(2)}</Text>.
        </Text>

        <Text style={styles.paragraph}>
          Este documento se suscribe para dejar constancia de los valores pactados y aceptados por ambas partes al inicio de la relación laboral.
        </Text>

        {/* Sección de Firmas */}
        <View style={styles.signatureSection}>

          <View style={{ width: '48%' }}>
            <Text style={[styles.signatureText, styles.bold]}>&nbsp;</Text>
            <View style={styles.signatureSpace} />
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Firma Talento Humano:</Text>
            <Text style={styles.signatureText}>Nombre: Diana Salazar</Text>
            <Text style={styles.signatureText}>Cargo: Jefe de Talento Humano</Text>
            <Text style={[styles.signatureText, styles.bold]}>URBAPARK S.A.</Text>
          </View>

          <View style={{ width: '48%' }}>
            <Text style={[styles.signatureText, styles.bold]}>FIRMAS RESPONSABLES</Text>
            <View style={styles.signatureSpace} />
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Firma del colaborador(a):</Text>
            <Text style={styles.signatureText}>Nombre: {nombreEmpleado}</Text>
            <Text style={styles.signatureText}>C.I.: {cedula}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}