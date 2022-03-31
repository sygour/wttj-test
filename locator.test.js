const locator = require('./locator');

test('Should get a continent for any location', () => {
  for (let i = 0; i < 100; i++) {
    const continent = locator.get_continent('0', '0');
    expect(continent).toBeDefined();
  }
});
