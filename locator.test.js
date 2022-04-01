const locator = jest.requireActual('./locator');

test('Should get a continent for any location', async() => {
  for (let i = 0; i < 100; i++) {
    const continent = await locator.get_continent('0', '0');
    expect(continent).toBeDefined();
  }
});
