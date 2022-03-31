const continents = [
  'europe', 'asie', 'afrique', 'amérique', 'océanie', 'antarctique'
];

const random_continent = () => {
  const continents_count = continents.length;
  const rand = Math.random();
  return continents[Math.floor(rand * continents_count)];
}

const get_continent = (lat, lon) => {
  return random_continent();
}

module.exports = {
  get_continent,
};
