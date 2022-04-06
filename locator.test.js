const locator = jest.requireActual('./locator');
const geo_json_places = jest.mock('geojson-places');

beforeEach(() => {
  geo_json_places.lookUp = (lat, lon) => ({
    continent_code: 'EU',
    country_a2: 'ES',
    country_a3: 'ESP',
    region_code: 'ES-CL',
    state_code: 'ES-VA'
  })
})

test('Should get a continent for any location', async() => {
  for (let i = 0; i < 100; i++) {
    const continent = await locator.get_continent('0', '0');
    expect(continent).toBeDefined();
  }
});

test('Should get continent from location', () => {
  const fromLib = locator.get_continent(41.652349, -4.728602);
  console.log(fromLib);
  expect(fromLib).toBeDefined();
});
