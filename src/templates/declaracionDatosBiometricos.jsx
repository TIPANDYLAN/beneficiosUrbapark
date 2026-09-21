// src/templates/DeclaracionDatosBiometricos.jsx
import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

// Evita la división de palabras con guiones
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
    page: {
        paddingTop: 35,
        paddingBottom: 35,
        paddingHorizontal: 45,
        fontSize: 10.5,
        fontFamily: 'Times-Roman',
        lineHeight: 1.45,
        color: '#000000',
    },
    logoContainer: {
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    logo: {
        width: 120,
        height: 'auto',
    },
    title: {
        fontSize: 11.5,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        width: '100%',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 10.5,
        fontWeight: 'bold',
        marginTop: 9,
        marginBottom: 6,
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    paragraph: {
        textAlign: 'justify',
        marginBottom: 6,
    },
    bold: {
        fontWeight: 'bold',
    },
    italic: {
        fontStyle: 'italic',
    },
    signaturesContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Cambiado a flex-start para alinear desde arriba
    },
    signatureBox: {
        width: '45%',
    },
    signatureSpace: {
        height: 45, // Espacio para la firma manuscrita
    },
    signatureLine: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        marginBottom: 6,
    },
    signatureText: {
        fontSize: 10,
        lineHeight: 1.3,
    },
});

export const DeclaracionDatosBiometricos = ({ empleado }) => {
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
                <View style={styles.logoContainer}>
                    <Image src="/logo156.png" style={styles.logo} />
                </View>
                {/* Título Principal */}
                <Text style={styles.title}>
                    DECLARACIÓN DE CONSENTIMIENTO PARA TRATAMIENTO DE DATOS PERSONALES BIOMÉTRICOS
                </Text>

                {/* Comparecientes */}
                <Text style={styles.paragraph}>
                    Comparecen al otorgamiento del presente documento, por una parte el señor@ <Text style={styles.bold}>{nombre} {apellido}</Text> por sus propios y personales derechos, a quien se llamará como <Text style={styles.italic}>TRABAJADOR</Text>; y, por otra parte la compañía <Text style={styles.bold}>ESTACIONAMIENTOS URBANOS URBAPARK S.A.</Text>, con RUC No. 1792086787001, legalmente representada por BURBANO DE LARA CORREA PABLO ENRIQUE en su calidad de GERENTE GENERAL, parte a la que se llamará como <Text style={styles.italic}>EMPLEADOR</Text>.
                </Text>

                {/* Antecedentes */}
                <Text style={styles.sectionTitle}>I.    ANTECEDENTES:</Text>
                <Text style={styles.paragraph}>
                    Con fecha <Text style={styles.bold}>{fechaTextoContratacion}</Text> el EMPLEADOR contrató los servicios lícitos y personales del señor@ <Text style={styles.bold}>{nombre} {apellido}</Text>, quien actualmente ocupa el cargo de <Text style={styles.bold}>{cargo}</Text>.
                </Text>
                <Text style={styles.paragraph}>
                    La Ley de Protección de Datos Personales determina que el tratamiento de datos personales será legítimo y lícito cuando se cuente con el consentimiento del titular para una o varias finalidades específicas.
                </Text>
                <Text style={styles.paragraph}>
                    El EMPLEADOR requiere contar con un sistema de registro biométrico para el personal que labora en la empresa, a efectos de garantizar la seguridad del personal y de las instalaciones. El registro biométrico permite contar con una herramienta más segura de control de ingreso a la empresa.
                </Text>

                {/* Consentimiento y Finalidad */}
                <Text style={styles.sectionTitle}>II.   CONSENTIMIENTO Y FINALIDAD:</Text>
                <Text style={styles.paragraph}>
                    Por el presente documento el señor@ <Text style={styles.bold}>{nombre} {apellido}</Text> de manera libre, voluntaria y expresa de entre las varias alternativas que propuso el Empleador está de acuerdo y da su consentimiento y autorización para que el EMPLEADOR utilice sus datos personales biométricos <Text style={styles.italic}>(huellas dactilares, reconocimiento facial, iris y retina)</Text> para el control de ingreso a las instalaciones de la empresa; y, para registro de asistencia.
                </Text>

                {/* Confidencialidad */}
                <Text style={styles.sectionTitle}>III.  CONFIDENCIALIDAD Y SEGURIDAD</Text>
                <Text style={styles.paragraph}>
                    El EMPLEADOR se compromete a mantener la confidencialidad de los datos personales y a garantizar la seguridad de estos a través de medidas físicas, jurídicas, técnicas, administrativas y organizativas que resulten necesarias.
                </Text>

                {/* Transferencia */}
                <Text style={styles.sectionTitle}>IV.   TRANSFERENCIA DE DATOS PERSONALES</Text>
                <Text style={styles.paragraph}>
                    En los casos en que el responsable del tratamiento de los datos personales requiera transferir los datos a su cargo a terceros, se compromete a cumplir con la legislación vigente y garantizar que el o los terceros presten un nivel adecuado de seguridad. Además, deberá contar con el consentimiento expreso del Representante Legal de la Compañía.
                </Text>

                {/* Derechos */}
                <Text style={styles.sectionTitle}>V.    DERECHOS DE LOS TITULARES DE LOS DATOS</Text>
                <Text style={styles.paragraph}>
                    El EMPLEADOR se compromete a respetar los derechos de los titulares establecidos en la Ley de Protección de Datos, su reglamento, este instrumento y demás normativa aplicable.
                </Text>

                {/* Duración */}
                <Text style={styles.sectionTitle}>VI.   DURACIÓN DEL TRATAMIENTO</Text>
                <Text style={styles.paragraph}>
                    El EMPLEADOR conservará los datos personales biométricos materia del presente consentimiento por un plazo de hasta 90 días posteriores a la terminación de la relación laboral.
                </Text>

                {/* Aceptación */}
                <Text style={styles.sectionTitle}>VII.  ACEPTACIÓN</Text>
                <Text style={styles.paragraph}>
                    Los comparecientes aceptan el contenido íntegro del presente documento, declarando que han sido debidamente informados sobre el propósito, uso y tratamiento que se dará al mismo.
                </Text>

                <Text style={styles.paragraph}>
                    Para constancia de lo expuesto suscribimos en 2 ejemplares de igual tenor y valor en la ciudad de Quito, a los {dia} días del mes de {mes} del año {anio}.
                </Text>

                {/* Sección de Firmas en 2 columnas */}
                <View style={styles.signaturesContainer}>
                    {/* Firma Empleador */}
                    <View style={styles.signatureBox}>
                        <View style={{ height: 35 }} />
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureText}>
                            <Text style={styles.bold}>BURBANO DE LARA CORREA PABLO ENRIQUE</Text>{'\n'}
                            <Text style={styles.bold}>GERENTE GENERAL</Text>{'\n'}
                            <Text style={styles.bold}>ESTACIONAMIENTOS URBANOS URBAPARK S.A.</Text>{'\n'}
                            RUC: 1792086787001{'\n'}
                            <Text style={styles.bold}>EMPLEADOR</Text>
                        </Text>
                    </View>

                    {/* Firma Trabajador */}
                    <View style={styles.signatureBox}>
                        <View style={{ height: 35 }} />
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureText}>
                            (FIRMA){'\n'}
                            <Text style={styles.bold}>Nombre: </Text>{nombre} {apellido}{'\n'}
                            <Text style={styles.bold}>C.C.: </Text>{cedula}{'\n'}
                            <Text style={styles.bold}>TRABAJADOR</Text>
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default DeclaracionDatosBiometricos;