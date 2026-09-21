import assert from 'node:assert/strict';
import { runPatientFlow } from '../main.js';

const originalFetch = globalThis.fetch;

test('runPatientFlow resolves patient ids before fetching data', async () => {
  globalThis.fetch = async (url, options) => {
    if (url.includes('/Patient') && options.method === 'POST') {
      return {
        status: 200,
        json: async () => ({ id: `patient-${Math.random().toString(16).slice(2)}` }),
      };
    }

    if (url.includes('/Patient/') && options.method === 'GET') {
      const id = url.split('/').pop();
      return {
        status: 200,
        json: async () => ({ resourceType: 'Patient', id }),
      };
    }

    throw new Error(`Unhandled fetch: ${url}`);
  };

  try {
    const patients = [
      { pin_lokal: 'A1', nama_lengkap: 'A', nik: '1', tgl_lahir: '2000-01-01', gender: 'L', alamat: 'X', no_telepon: '081' },
      { pin_lokal: 'B1', nama_lengkap: 'B', nik: '2', tgl_lahir: '2001-02-02', gender: 'P', alamat: 'Y', no_telepon: '082' },
    ];

    const result = await runPatientFlow(patients);

    assert.equal(result.length, 2);
    assert.ok(result.every((patient) => patient && patient.id));
  } finally {
    globalThis.fetch = originalFetch;
  }
});
