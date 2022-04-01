const aggregator = jest.requireActual('./aggregator');
const data_provider = require('./data_provider')

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
})

test('Should count all jobs', async () => {
  const result = await aggregator.jobs_per_category_and_continent();

  expect(result).toBeDefined();
  expect(result.professions).toBeDefined()
  expect(result.professions.total).toBeDefined()
  expect(result.professions.total).toBe(1);
});

