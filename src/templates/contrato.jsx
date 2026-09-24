// src/templates/Contrato.jsx
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import numeroALetras from '../utils/numeroALetras'

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50,
    fontSize: 10,
    fontFamily: 'Times-Roman',
    lineHeight: 1.5,
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
    marginBottom: 15,
  },
  title: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    width: '100%',
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    marginTop: 4,
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
    marginBottom: 10,
  },
  bold: {
    fontFamily: 'Times-Bold',
  },
  detailsBox: {
    marginVertical: 8,
    paddingLeft: 10,
    lineHeight: 1,
  },
  signatureSection: {
    marginTop: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  signatureSpace: {
    height: 45,
  },
  signatureLine: {
    width: 220,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginBottom: 6,
  },
  signatureText: {
    fontSize: 9,
    textAlign: 'left',
    lineHeight: 1.4,
  },
});

export default function Contrato({ empleado, fechaEmision }) {
  const nombreEmpleado = `${empleado?.nombre || empleado?.nombres || ''} ${
    empleado?.apellido || empleado?.apellidos || ''
  }`.trim();

  const cedula = empleado?.cedula || empleado?.numCedula || empleado?.identificacion || '';
  const ciudad = empleado?.ciudad || 's/n';
  const cargo = empleado?.cargo || 's/n';
  const sueldoNumero = empleado?.sueldo ? Number(empleado.sueldo).toFixed(2) : '482.00';
  const sueldoTexto = empleado?.sueldoLetras || numeroALetras(sueldoNumero);
  const direccion = empleado?.direccion || 's/n';
  const telefono = empleado?.telefono || 's/n';
  const celular = empleado?.celular || 's/n';
  const email = empleado?.email || empleado?.correo || 's/n';

  const obtenerPartesFecha = (fechaStr) => {
    if (!fechaStr) return { dia: '___', mes: '___________', anio: '______' };

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
  
        <View style={styles.logoContainer}>
          <Image src="/logo156.png" style={styles.logo} />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            CONTRATO DE TRABAJO ESPECIAL PARA LOS SECTORES PRODUCTIVOS
          </Text>
        </View>

        {/* Comparecencia */}
        <Text style={styles.paragraph}>
          En la ciudad de <Text style={styles.bold}>{ciudad}</Text> a los{' '}
          <Text style={styles.bold}>{dia}</Text> días del mes de <Text style={styles.bold}>{mes}</Text>{' '}
          del año <Text style={styles.bold}>{anio}</Text>, comparecen por una parte, la compañía{' '}
          <Text style={styles.bold}>ESTACIONAMIENTOS URBANOS URBAPARK S.A.</Text>, legal y debidamente
          representada por <Text style={styles.bold}>BURBANO DE LARA CORREA PABLO ENRIQUE</Text> en su
          calidad de GERENTE GENERAL, a quien en adelante se denominará “EMPLEADOR”, y por otra, el/la
          señor/a <Text style={styles.bold}>{nombreEmpleado}</Text>, con cédula de ciudadanía número{' '}
          <Text style={styles.bold}>{cedula}</Text>, por sus propios y personales derechos, a quien en
          adelante se le denominará “TRABAJADOR”.
        </Text>

        <Text style={styles.paragraph}>
          A los comparecientes se los denominará como “PARTES” y de forma individual, como “PARTE”.
        </Text>

        <Text style={styles.paragraph}>
          Los comparecientes son mayores de edad, hábiles en derecho para contratar y obligarse, quienes libre
          y voluntariamente por los derechos que representan, convienen en celebrar el presente Contrato de
          Trabajo Especial para los Sectores Productivos (en adelante “Contrato Productivo”) de conformidad
          con las estipulaciones contenidas en las siguientes cláusulas:
        </Text>

        {/* CLÁUSULA PRIMERA */}
        <Text style={styles.sectionTitle}>
            CLÁUSULA PRIMERA: ANTECEDENTES. -
        </Text>
        <Text style={styles.paragraph}>
          La compañía ESTACIONAMIENTOS URBANOS URBAPARK S.A., es una compañía legalmente constituida
          bajo el amparo de la Leyes de la República del Ecuador, su domicilio principal es la ciudad de
          Quito, Provincia de PICHINCHA.
        </Text>
        <Text style={styles.paragraph}>
          Dentro del giro de su actividad, el EMPLEADOR requiere contratar los servicios de una persona para
          que realice las actividades de TRABAJADOR OPERATIVO, de conformidad con las actividades
          establecidas en el descriptivo de funciones y/o el Reglamento Interno de Trabajo del EMPLEADOR.
        </Text>
        <Text style={styles.paragraph}>
          El TRABAJADOR declara que tiene los conocimientos, experiencia y competencias necesarias para
          desarrollar las labores para las cuales es contratado.
        </Text>
        <Text style={styles.paragraph}>
          Mediante el Acuerdo Ministerial Nro. MDT-2020-220 el Ministerio de Trabajo expidió la norma que
          regula la modalidad contractual especial para los sectores productivos en el cual se regula el
          contrato productivo que tiene como finalidad incentivar la generación de empleo y la
          formalización del trabajo en los sectores productivos.
        </Text>

        {/* CLÁUSULA SEGUNDA */}
        <Text style={styles.sectionTitle}>
            CLÁUSULA SEGUNDA: OBJETO. - 
        </Text>
        <Text style={styles.paragraph}>
          Con estos antecedentes expuestos, EL EMPLEADOR contrata los servicios lícitos y personales del
          señor/a <Text style={styles.bold}>{nombreEmpleado}</Text>, para que desempeñe las funciones de{' '}
          <Text style={styles.bold}>{cargo}</Text>, cuyas actividades constan descritas en el descriptivo
          de funciones y/o el Reglamento Interno de Trabajo, así como en aquellas actividades inherentes a
          dicha posición de conformidad con las instrucciones verbales o escritas que le serán
          suministradas en el momento oportuno y de acuerdo con las necesidades o requerimientos de EL
          EMPLEADOR.
        </Text>

        {/* CLÁUSULA TERCERA */}
        <Text style={styles.sectionTitle}>
            CLÁUSULA TERCERA: OBLIGACIONES DEL TRABAJADOR. - 
        </Text>
        <Text style={styles.paragraph}>
          A más de observar las disposiciones del Código del Trabajo y el Reglamento Interno de Trabajo, son
          obligaciones del TRABAJADOR, las siguientes:
        </Text>
        <Text style={[styles.paragraph, { paddingLeft: 15 }]}>
          a) No podrá suspender o abandonar el sitio destinado a sus funciones, sin la autorización previa
          del EMPLEADOR;
        </Text>
        <Text style={[styles.paragraph, { paddingLeft: 15 }]}>
          b) Deberá cumplir con diligencia, capacidad, eficiencia y honradez toda gestión que se le encomiende
          y que se encuentre dentro del campo de sus funciones, sujetándose a las normas, procedimientos,
          reglamentos, horarios y demás disposiciones laborales vigentes en el sitio del trabajo y las que
          más adelante se expidieren;
        </Text>
        <Text style={[styles.paragraph, { paddingLeft: 15 }]}>
          c) Hacer uso adecuado de todos los materiales, documentos, útiles, equipos, maquinarias y en
          general las herramientas que le fueren entregadas para la ejecución de sus actividades o que
          estuvieren bajo su cuidado o vigilancia. De acuerdo con la normativa interna, se obliga a responder
          y responsabilizarse por los daños que se originen por el uso inadecuado, por la pérdida, por el
          deterioro o destrucción de esos bienes. El valor de aquellos bienes de propiedad del TRABAJADOR,
          que sean considerados como destruidos, dañados o perdidos, como producto de la negligencia,
          descuido o uso inadecuado del TRABAJADOR, podrá ser descontado de su remuneración, conforme lo
          establecido en el reglamento interno de trabajo.
        </Text>

        {/* CLÁUSULA CUARTA */}
        <Text style={styles.sectionTitle}>
            CLÁUSULA CUARTA: LUGAR DE TRABAJO. - 
        </Text>
        <Text style={styles.paragraph}>
          El trabajo contratado será prestado por el TRABAJADOR, en las instalaciones del EMPLEADOR ubicadas
          en la ciudad de {ciudad}. El EMPLEADOR podrá trasladar sus oficinas a otro lugar dentro de la ciudad
          o disponer que el TRABAJADOR cumpla sus labores en otro lugar o ciudad, lo cual es expresamente
          aceptado por el TRABAJADOR, para lo cual el EMPLEADOR deberá notificarle a través de los mecanismos
          de comunicación previstos en el presente contrato. En caso de que el lugar de trabajo sea fuera
          de la ciudad EL EMPLEADOR deberá dar cumplimiento a lo determinado en el numeral 22 del Art. 42
          del Código del Trabajo.
        </Text>

        {/* CLÁUSULA QUINTA */}
        <Text style={styles.sectionTitle}>
            CLÁUSULA QUINTA: PLAZO Y PERÍODO DE PRUEBA. - 
        </Text>
        <Text style={styles.paragraph}>
          El presente contrato tendrá un plazo de vigencia de UN (1) año, pudiendo ser renovado por una sola
          vez hasta por UN (1) año adicional a decisión del EMPLEADOR. Los primeros NOVENTA (90) días del
          plazo antes señalado serán de prueba, tiempo durante el cual cualquiera de las partes podrá darlo
          por terminado comunicando a la otra de dicha decisión, sin que se genere el pago de
          indemnizaciones.
        </Text>
        <Text style={styles.paragraph}>
          El EMPLEADOR deberá comunicar al TRABAJADOR su decisión de renovar o dar por terminado el presente
          contrato pudiendo inclusive hacerlo el último día del plazo pactado, comunicación que podrá
          hacerla el EMPLEADOR a la dirección de correo electrónico señalada en este contrato.
        </Text>

        {/* CLÁUSULA SEXTA */}
        <Text style={styles.sectionTitle}>
            CLÁUSULA SEXTA: JORNADAS Y HORARIO DE TRABAJO. - 
        </Text>
        <Text style={styles.paragraph}>
          La jornada laboral ordinaria objeto de este contrato será de cuarenta (40) horas semanales, las
          cuales podrán ser distribuidas en un máximo de seis (6) días a la semana sin sobrepasar las ocho
          (8) horas diarias. El TRABAJADOR tendrá al menos 24 horas de descanso consecutivas a la semana.
        </Text>
        <Text style={styles.paragraph}>
          En caso de requerir la prestación de servicios ininterrumpidos para atender las necesidades del
          negocio, el EMPLEADOR podrá establecer jornadas de trabajo de hasta 20 días consecutivos de labores
          y 8 días de descanso consecutivos, pudiendo el EMPLEADOR distribuir los días de labores y de
          descanso antes señalados de conformidad con sus necesidades, lo cual deberá ser comunicado al
          TRABAJADOR.
        </Text>
        <Text style={styles.paragraph}>
          En caso de que los días de descanso acumulados concedidos al TRABAJADOR superan el número de días de
          descanso forzoso o de compensación, serán imputables al período de días de vacación anual a que
          tiene derecho cada trabajador de conformidad con el artículo 69 del Código del Trabajo. Sin
          perjuicio de que estos días sean remunerados.
        </Text>
        <Text style={styles.paragraph}>
          Los comparecientes acuerdan que el EMPLEADOR podrá disponer el incremento de horas de la jornada
          diaria de trabajo, a cambio de que se otorgue al trabajador más días de descanso determinados por el
          EMPLEADOR, para compensar tales horas adicionales, pero en ningún caso la jornada excederá de doce
          (12) horas al día. Si se llegare a exceder el número de horas de trabajo o laborar durante los
          días que corresponda a descansos forzosos acumulados, se estará a lo dispuesto en el artículo 55 del
          Código de Trabajo.
        </Text>
        <Text style={styles.paragraph}>
          En los horarios señalados no se encuentra incluido el tiempo para alimentación, el cual podrá ser de
          hasta una (1) hora que será determinado por el EMPLEADOR, debiendo considerarse que el tiempo de
          alimentación no forma parte de la jornada de trabajo.
        </Text>
        <Text style={styles.paragraph}>
          En caso de trabajadores que se encuentren bajo estado de llamada o stand by, en horarios o turnos
          fuera de la jornada ordinaria de trabajo establecida, la Compañía pagará únicamente las horas
          efectivamente laboradas es decir aquellas llamadas o casos atendidos bajo este régimen, con los
          recargos establecidos en la Ley.
        </Text>
        <Text style={styles.paragraph}>
          El EMPLEADOR establecerá los horarios y jornadas en que el TRABAJADOR prestará sus servicios,
          debiendo comunicar de los mismos a través de los canales y medios que determine el EMPLEADOR.
        </Text>
        <Text style={styles.paragraph}>
          El TRABAJADOR queda prohibido de laborar horas suplementarias o extraordinarias sin autorización
          escrita de su Empleador a través de su Jefe inmediato de conformidad con la política que para el
          efecto emita el EMPLEADOR.
        </Text>
        <Text style={styles.paragraph}>
          El TRABAJADOR declara conocer y acepta someterse a los horarios especiales que el EMPLEADOR
          establezca para el correcto desempeño de sus funciones, de conformidad con las necesidades de la
          compañía, que han sido debidamente aprobados por el Ministerio de Trabajo mediante Resolución
          Aprobación de Horarios de Trabajo Nro. MDT-DRTSP2-2026-3125-R1-KQ.
        </Text>
        <Text style={styles.paragraph}>
          El TRABAJADOR manifiesta su consentimiento libre, expreso y voluntario para que, el EMPLEADOR en
          futuro estructure los horarios especiales necesarios para el cumplimiento de sus actividades y
          solicite la aprobación ante el Ministerio del Trabajo.
        </Text>

        {/* CLÁUSULA SÉPTIMA */}
        <Text style={styles.sectionTitle}>
            CLÁUSULA SÉPTIMA: REMUNERACIÓN. - 
        </Text>
        <Text style={styles.paragraph}>
          EL EMPLEADOR se obliga a pagar al TRABAJADOR, por los servicios prestados, la suma de{' '}
          <Text style={styles.bold}>USD$ {sueldoNumero} ({sueldoTexto})</Text>, cantidad que le será pagada mensualmente, de
          acuerdo con lo establecido por el EMPLEADOR.
        </Text>
        <Text style={styles.paragraph}>
          Las partes contratantes, expresamente acuerdan que todos los aumentos y revisiones salariales que
          efectúe el EMPLEADOR, voluntariamente, durante la vigencia de este contrato de trabajo, serán
          imputables a cualquier revisión, aumento o fijación de sueldos que ordene el Ministerio del Trabajo,
          durante el mismo lapso y en cualquier forma que lo realice.
        </Text>
        <Text style={styles.paragraph}>
          De la remuneración del TRABAJADOR, se deducirán los valores que correspondan al Instituto
          Ecuatoriano de Seguridad Social, los respectivos del impuesto a la renta en el evento de que sea
          procedente de conformidad con la Ley y todos aquellos previstos en las políticas internas de trabajo
          y Reglamento Interno de Trabajo que cuenten con autorización por escrito, por parte del TRABAJADOR.
        </Text>
        <Text style={styles.paragraph}>
          El EMPLEADOR se obliga a entregar al TRABAJADOR el rol de pago de la remuneración del TRABAJADOR, en
          donde deberán constar de manera detallada los ingresos y descuentos aplicados. La entrega del rol de
          pagos puede realizarse mediante correo electrónico designado por el TRABAJADOR en este contrato, en el
          correo institucional que se le entregue o mediante el INTRANET que mantiene la compañía. Una vez
          recibido el rol de pagos, el TRABAJADOR tiene tres (3) días hábiles para realizar observaciones en
          caso de tenerlas o, caso contrario, se entenderá aceptado en su totalidad.
        </Text>
        <Text style={styles.paragraph}>
          Además, EL EMPLEADOR pagará a EL TRABAJADOR, las remuneraciones adicionales y beneficios sociales a
          los que tenga derecho de conformidad con la Ley.
        </Text>

        {/* CLÁUSULA OCTAVA */}
        <Text style={styles.sectionTitle}>
            CLÁUSULA OCTAVA: TELETRABAJO. – 
        </Text>
        <Text style={styles.paragraph}>
          Las partes, de común acuerdo, establecen que durante la ejecución del Contrato de Trabajo el
          EMPLEADOR podrá disponer el cambio de modalidad a teletrabajo para la ejecución de las labores, las
          cuales podrán desarrollarse desde el domicilio del TRABAJADOR o desde el lugar que ambas partes
          determinen de mutuo acuerdo.
        </Text>
        <Text style={styles.paragraph}>
          La modalidad de teletrabajo podrá ser autónoma, móvil, parcial u ocasional, conforme a lo
          establecido en el Código del Trabajo. El EMPLEADOR será quien determine los días en que las labores se
          desarrollarán bajo la modalidad de teletrabajo o de manera presencial.
        </Text>

        {/* CLÁUSULA NOVENA */}
        <Text style={styles.sectionTitle}>
            CLÁUSULA NOVENA: EXCLUSIVIDAD. - 
        </Text>
        <Text style={styles.paragraph}>
          El TRABAJADOR, durante la vigencia del presente contrato, no podrá prestar sus servicios para otra
          persona natural o jurídica que realice o pretenda realizar actividades iguales o equivalentes a las
          del EMPLEADOR, salvo autorización expresa y por escrito de este último.
        </Text>

        {/* CLÁUSULA DÉCIMA */}
        <Text style={styles.sectionTitle}>
            CLÁUSULA DÉCIMA: TERMINACIÓN ANTICIPADA DEL CONTRATO. - 
        </Text>
        <Text style={styles.paragraph}>
          Las partes pueden dar por terminado anticipadamente el contrato por acuerdo entre las partes, por
          cumplimiento del plazo, por faltas graves o muy graves al Reglamento Interno previo visto bueno, o por
          las causales previstas en los artículos 169, 172 y 173 del Código del Trabajo.
        </Text>

        {/* CLÁUSULAS 11 A 16 */}
        <Text style={styles.sectionTitle}>
            CLÁUSULA DÉCIMA PRIMERA: COMPROMISO CERO TOLERANCIA FRENTE A DISCRIMINACIÓN, VIOLENCIA Y ACOSO. -{' '}
        </Text>
        <Text style={styles.paragraph}>
          El TRABAJADOR declara haber recibido, leído y comprendido el Protocolo Interno de Prevención y
          Erradicación de la Discriminación, Violencia y Acoso Laboral, asumiendo el compromiso de cero
          tolerancia.
        </Text>

        <Text style={styles.sectionTitle}>
            CLÁUSULA DÉCIMA SEGUNDA: ACUERDO ESPECIAL. - 
        </Text>
        <Text style={styles.paragraph}>
          El TRABAJADOR acepta realizar tareas fuera del horario establecido conforme a la Política de
          Desconexión del EMPLEADOR.
        </Text>

        <Text style={styles.sectionTitle}>
            CLÁUSULA DÉCIMA TERCERA: INVENCIONES. - 
        </Text>
        <Text style={styles.paragraph}>
          Los descubrimientos e invenciones realizadas durante la prestación de servicios quedarán bajo
          propiedad exclusiva del EMPLEADOR.
        </Text>

        <Text style={styles.sectionTitle}>
            CLÁUSULA DÉCIMA CUARTA: CONFIDENCIALIDAD. - 
        </Text>
        <Text style={styles.paragraph}>
          Es obligación del TRABAJADOR guardar absoluta reserva sobre toda la información a la que tenga
          acceso con ocasión de sus labores.
        </Text>

        <Text style={styles.sectionTitle}>
            CLÁUSULA DÉCIMA QUINCE: TRATAMIENTO DE DATOS PERSONALES. – 
        </Text>
        <Text style={styles.paragraph}>
          El EMPLEADOR tratará los datos personales del TRABAJADOR únicamente para fines laborales y conforme a
          la Ley Orgánica de Protección de Datos Personales.
        </Text>

        <Text style={styles.sectionTitle}>
            CLÁUSULA DÉCIMA SEXTA: NORMAS SUPLETORIAS. - 
        </Text>
        <Text style={styles.paragraph}>
          En lo no previsto, las partes se someten al Código del Trabajo y normas aplicables.
        </Text>

        {/* CLÁUSULA DÉCIMA SÉPTIMA */}
        <Text style={styles.sectionTitle}>
            CLÁUSULA DÉCIMA SÉPTIMA: INFORMACIÓN. - 
        </Text>
        <Text style={styles.paragraph}>
          Para notificaciones, el TRABAJADOR señala la siguiente información:
        </Text>
        <View style={styles.detailsBox}>
          <Text>
            <Text style={styles.bold}>Dirección domicilio: </Text>
            {direccion}
          </Text>
          <Text>
            <Text style={styles.bold}>Teléfono domicilio: </Text>
            {telefono}
          </Text>
          <Text>
            <Text style={styles.bold}>Teléfono celular: </Text>
            {celular}
          </Text>
          <Text>
            <Text style={styles.bold}>Correo electrónico personal: </Text>
            {email}
          </Text>
          <Text>
            <Text style={styles.bold}>Persona de contacto y número telefónico fijo y celular: </Text>
            {celular}
          </Text>
        </View>

        {/* CLÁUSULA DÉCIMA OCTAVA Y NOVENA */}
        <Text style={styles.sectionTitle}>
            CLÁUSULA DÉCIMA OCTAVA: JURISDICCIÓN. - 
        </Text>
        <Text style={styles.paragraph}>
          Para cualquier controversia, las partes se someten a los Juzgados y Tribunales de la Provincia de
          Pichincha.
        </Text>

        <Text style={styles.sectionTitle}>
            CLÁUSULA DÉCIMA NOVENA: RATIFICACIÓN. – 
        </Text>
        <Text style={styles.paragraph}>
          Las partes ratifican el contenido de las cláusulas precedentes, firmando en unidad de acto por
          triplicado.
        </Text>

        {/* Seccion de Firmas */}
        <View style={styles.signatureSection}>
          <View style={{ width: '48%' }}>
            <View style={styles.signatureSpace} />
            <View style={styles.signatureLine} />
            <Text style={[styles.signatureText, styles.bold]}>
              BURBANO DE LARA CORREA PABLO ENRIQUE
            </Text>
            <Text style={styles.signatureText}>GERENTE GENERAL</Text>
            <Text style={styles.signatureText}>ESTACIONAMIENTOS URBANOS URBAPARK S.A.</Text>
            <Text style={[styles.signatureText, styles.bold]}>EMPLEADOR</Text>
          </View>

          <View style={{ width: '48%' }}>
            <View style={styles.signatureSpace} />
            <View style={styles.signatureLine} />
            <Text style={[styles.signatureText, styles.bold]}>{nombreEmpleado}</Text>
            <Text style={styles.signatureText}>C.C.: {cedula}</Text>
            <Text style={[styles.signatureText, styles.bold]}>TRABAJADOR</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}