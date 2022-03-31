const data_provider = require('./data_provider');

test('Should retrieve empty array', () => {
  const result = data_provider.read_professions();

  expect(result).toHaveLength(0);
});
