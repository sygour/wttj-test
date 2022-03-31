const data_provider = require('./data_provider');

test('Should retrieve at least professions', async () => {
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
