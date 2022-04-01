const data_provider = require('./data_provider');

test('Should retrieve at least one profession', async () => {
  const result = await data_provider.read_professions();

  expect(result).toBeDefined();
  expect(result.length).toBeGreaterThan(0);
  expect(result[0]).toMatchObject(
    {
      id: 17,
      name: 'Devops / Infrastructure',
      category_name: 'Tech',
    },
  );
});

test('Should have only specified professions', async () => {
  const result = await data_provider.read_professions();

  expect(result).toBeDefined();
  for (const profession of result) {
    expect(profession).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      category_name: expect.any(String),
    })
  }
});

test('Should retrieve at least one job', async () => {
  const result = await data_provider.read_jobs();

  expect(result).toBeDefined();
  expect(result.length).toBeGreaterThan(0);
  expect(result[0]).toMatchObject(
    {
      profession_id: 7,
      contract_type: 'INTERNSHIP',
      name: '[Louis Vuitton Germany] Praktikant (m/w) im Bereich Digital Retail (E-Commerce)',
      office_latitude: '48.1392154',
      office_longitude: '11.5781413',
    },
  );
});

test('Should have only specified jobs', async () => {
  const result = await data_provider.read_jobs();

  expect(result).toBeDefined();
  for (const job of result) {
    expect(job).toMatchObject({
      profession_id: expect.any(Number),
      contract_type: expect.any(String),
      name: expect.any(String),
      office_latitude: expect.any(String),
      office_longitude: expect.any(String),
    })
  }
});
