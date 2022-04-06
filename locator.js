const geo_json_places = require("geojson-places");

const random_continent = () => {
  const available_continents = continents();
  const continents_count = available_continents.length;
  const rand = Math.random();
  return available_continents[Math.floor(rand * continents_count)];
}

const continents_mapping = {
  'EU': 'europe',
  'AS': 'asie',
  'AF': 'afrique',
  'NA': 'amérique du sud',
  'SA': 'amérique du nord',
  'OC': 'océanie',
  'AN': 'antarctique'
};

const get_continent = (lat, lon) => {
  const lookup = geo_json_places.lookUp(lat, lon)
  if (lookup) {
    return continents_mapping[lookup.continent_code]
  }
}

const continents = () => {
  const result = [];
  for (let code in continents_mapping) {
    result.push(continents_mapping[code]);
  }
  return result;
};

module.exports = {
  get_continent: get_continent,
  continents: continents(),
};
