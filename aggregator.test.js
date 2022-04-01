const aggregator = jest.requireActual('./aggregator');
const data_provider = require('./data_provider')
const locator = require('./locator')

const JOB_EXAMPLE = {
  profession_id: 1,
  contract_type: 'a contract type',
  name: 'a job name',
  office_latitude: 'some latitude',
  office_longitude: 'some longitude',
};

beforeEach(() => {
  data_provider.read_jobs = async () => ([JOB_EXAMPLE]);
  data_provider.read_professions = async () => (
    [
      {
        id: 1,
        name: 'Devops / Infrastructure',
        category_name: 'Tech',
      }
    ]
  );
  locator.get_continent = async () => ("europe");
})

test('Should count jobs per category', async () => {
  const result = await aggregator.jobs_per_category_and_continent();

  expect(result).toBeDefined();
  expect(result['Tech']).toBeDefined()
  expect(result['Tech'].total).toBe(1);
});

test('Should count jobs per continent', async () => {
  const result = await aggregator.jobs_per_category_and_continent();

  expect(result).toBeDefined();
  expect(result['Tech']).toBeDefined()
  expect(result['Tech']['europe']).toBe(1);
});

test('Delayed location can cause count to be off', async () => {
  data_provider.read_jobs = async () => (Array(1_000).fill(JOB_EXAMPLE));
  locator.get_continent = async () => (new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('europe');
    }, Math.floor(Math.random() * 100));
  }));

  const result = await aggregator.jobs_per_category_and_continent();

  expect(result).toBeDefined();
  expect(result['Tech']).toBeDefined()
  expect(result['Tech']['europe']).toBe(1_000);
})
