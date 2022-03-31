const {promises: {readFile}} = require("fs");

const csv_to_profession = (line) => {
  const attributes = line.split(',');
  return {
    id: Number(attributes[0]),
    name: attributes[1],
    category_name: attributes[2],
  }
}

const read_professions = () => {
  return readFile('./data/technical-test-professions.csv', 'utf8')
      .then(data => {
        return data.split('\n')
            .slice(1)
            .map(csv_to_profession);
      });
}

module.exports = {
  read_professions,
};
