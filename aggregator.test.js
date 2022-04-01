const aggregator = jest.requireActual('./aggregator');
const data_provider = require('./data_provider')
const locator = require('./locator')

beforeEach(() => {
  data_provider.read_jobs = async () => (
    [
      {
        profession_id: 1,
        contract_type: 'a contract type',
        name: 'a job name',
        office_latitude: 'some latitude',
        office_longitude: 'some longitude',
      }
    ]
  );
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

test('Should count jobs per category total', async () => {
  const result = await aggregator.jobs_per_category_and_continent();

  expect(result).toBeDefined();
  expect(result.professions).toBeDefined()
  expect(result.professions.total).toBeDefined()
  expect(result.professions.total).toBe(1);
});

test('Should count jobs per category', async () => {
  const result = await aggregator.jobs_per_category_and_continent();

  expect(result).toBeDefined();
  expect(result.professions).toBeDefined()
  expect(result.professions['Tech']).toBeDefined()
  expect(result.professions['Tech']).toBe(1);
});

test('Should count jobs per continent total', async () => {
  const result = await aggregator.jobs_per_category_and_continent();

  expect(result).toBeDefined();
  expect(result.continents).toBeDefined()
  expect(result.continents.total).toBeDefined()
  expect(result.continents.total).toBe(1);
});
