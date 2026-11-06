const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const originalFetch = global.fetch;
const originalKey = process.env.N8N_API_KEY;
const load = file => import('data:text/javascript;base64,' + fs.readFileSync(path.join(root, file)).toString('base64'));
const client = load('src/api/getEmpleados.js');
const server = load('api/empleados.js');
const reply = (data, status = 200) => ({ ok: status < 400, status, json: async () => data });
const response = () => ({ headers: {}, setHeader(k,v) { this.headers[k] = v; }, status(s) { this.code = s; return this; }, json(d) { this.data = d; return this; }, end() { return this; } });
afterEach(() => { global.fetch = originalFetch; if (originalKey === undefined) delete process.env.N8N_API_KEY; else process.env.N8N_API_KEY = originalKey; });

test('lista ligera de n8n conserva nombres y cédulas sin exigir compañía', async () => {
  global.fetch = async url => { assert.equal(url, '/api/empleados'); return reply([{ cedula: '001', nombreCompleto: ' Ana  Pérez ' }]); };
  const [employee] = await (await client).obtenerEmpleados();
  assert.equal(employee.nombreCompleto, 'Ana Pérez');
  assert.equal(employee.nombre, 'Ana Pérez');
  assert.equal(employee.cedula, '001');
});
test('respuesta completa preserva campos de documentos y filtra compañía', async () => {
  global.fetch = async () => reply({ data: [{ json: { COD_MFCIA: '1', DOCI_MFEMP: '002', NOMBRES: 'Ana', APELLIDOS: 'Pérez', SLD_MFEDC: 600, CAR_DESCRIPCION: 'Operadora' } }, { COD_MFCIA: 2, NOMBRES: 'Otra' }, null] });
  const rows = await (await client).obtenerEmpleados();
  assert.equal(rows.length, 1);
  assert.equal(rows[0].nombreCompleto, 'Ana Pérez');
  assert.equal(rows[0].cargo, 'Operadora');
  assert.equal(rows[0].sueldo, 600);
});
test('formato inválido y fallos del backend no se convierten en lista vacía', async () => {
  global.fetch = async () => reply({ raw: '<html>' });
  await assert.rejects((await client).obtenerEmpleados(), /no devolvió una lista/);
  global.fetch = async () => reply({ message: 'n8n no disponible' }, 502);
  await assert.rejects((await client).obtenerEmpleados(), /n8n no disponible/);
});
test('API consulta n8n con clave solo en servidor y acepta el alias de producción', async () => {
  process.env.N8N_API_KEY = 'test-key';
  global.fetch = async (url, options) => { assert.match(url, /easypanel.host\/webhook\/general\/empleados\/nombres$/); assert.equal(options.headers['x-api-key'], 'test-key'); assert.ok(options.signal); return reply({ data: [{ nombreCompleto: 'Ana Pérez' }] }); };
  const res = response();
  await (await server).default({ method: 'GET', headers: { referer: 'https://beneficios-urbapark.vercel.app/contratacion' } }, res);
  assert.equal(res.code, 200);
  assert.equal(res.data.length, 1);
  assert.equal(res.headers['Access-Control-Allow-Origin'], 'https://beneficios-urbapark.vercel.app');
});
test('fallback usa únicamente n8n y rechaza respuestas no válidas', async () => {
  process.env.N8N_API_KEY = 'test-key';
  let calls = 0;
  global.fetch = async url => { calls++; assert.doesNotMatch(url, /nominaz/i); return calls === 1 ? reply({ unexpected: true }) : reply([{ nombreCompleto: 'Ana Pérez' }]); };
  const res = response();
  await (await server).default({ method: 'GET', headers: { origin: 'http://localhost:3000' } }, res);
  assert.equal(res.code, 200);
  assert.equal(calls, 2);
});
test('caída de n8n genera 502 con mensaje útil', async () => {
  process.env.N8N_API_KEY = 'test-key';
  global.fetch = async () => { throw new Error('network'); };
  const res = response();
  await (await server).default({ method: 'GET', headers: { origin: 'http://localhost:3000' } }, res);
  assert.equal(res.code, 502);
  assert.match(res.data.message, /n8n/);
});
test('origen con prefijo falso queda bloqueado antes de consultar datos', async () => {
  global.fetch = async () => assert.fail('No debe consultar n8n');
  const res = response();
  await (await server).default({ method: 'GET', headers: { origin: 'https://empleados-urbapark.vercel.app.ejemplo.com' } }, res);
  assert.equal(res.code, 403);
});
test('configuración ausente genera 503', async () => {
  delete process.env.N8N_API_KEY;
  global.fetch = async () => assert.fail('No debe consultar n8n');
  const res = response();
  await (await server).default({ method: 'GET', headers: { origin: 'http://localhost:3000' } }, res);
  assert.equal(res.code, 503);
});
