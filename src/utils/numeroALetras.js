// Helper para convertir números a su representación en letras
export default function numeroALetras(numero) {
  const num = parseFloat(numero);
  if (isNaN(num)) return '';

  const enteros = Math.floor(num);
  const centavos = Math.round((num - enteros) * 100);
  const strCentavos = centavos < 10 ? `0${centavos}` : `${centavos}`;

  const unidades = (n) => ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'][n] || '';
  const decenas = (n) => {
    if (n < 10) return unidades(n);
    if (n === 10) return 'DIEZ';
    if (n === 11) return 'ONCE';
    if (n === 12) return 'DOCE';
    if (n === 13) return 'TRECE';
    if (n === 14) return 'CATORCE';
    if (n === 15) return 'QUINCE';
    if (n < 20) return 'DIECI' + unidades(n - 10);
    if (n === 20) return 'VEINTE';
    if (n < 30) return 'VEINTI' + unidades(n - 20);
    const u = unidades(n % 10);
    const d = ['', '', '', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'][Math.floor(n / 10)];
    return u ? `${d} Y ${u}` : d;
  };
  const centenas = (n) => {
    if (n === 100) return 'CIEN';
    if (n < 100) return decenas(n);
    const d = decenas(n % 100);
    const c = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'][Math.floor(n / 100)];
    return d ? `${c} ${d}` : c;
  };
  const miles = (n) => {
    if (n < 1000) return centenas(n);
    const resto = n % 1000;
    const m = Math.floor(n / 1000);
    const prefix = m === 1 ? 'UN MIL' : `${centenas(m)} MIL`;
    return resto ? `${prefix} ${centenas(resto)}` : prefix;
  };

  const textoEnteros = enteros === 0 ? 'CERO' : miles(enteros);

  return `${textoEnteros} DÓLARES DE LOS ESTADOS UNIDOS DE NORTEAMÉRICA ${strCentavos}/100`;
}