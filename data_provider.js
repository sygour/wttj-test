const {promises: {readFile}} = require("fs");
const csv = require('csv-parser');

const csv_to_profession = (line) => {
  const attributes = line.split(',');
  return {
    id: Number(attributes[0]),
    name: attributes[1],
    category_name: attributes[2],
  }
}

const csv_to_jobs = (line) => {
  const attributes = line.split(',');
  return {
    profession_id: Number(attributes[0]),
    contract_type: attributes[1],
    name: attributes[2],
    office_latitude: parseFloat(attributes[3]),
    office_longitude: parseFloat(attributes[4]),
  }
}

const read_file_with_header = (file, line_mapper) => {
  return readFile(file, 'utf8')
    .then(data => {
      return data.split('\n')
        .
        .slice(1)
        .filter(line => line && line.length > 0)
        .map(line_mapper);
    });
}

const read_professions = () => {
  return read_file_with_header(
    './data/technical-test-professions.csv',
    csv_to_profession
  );
}

const read_jobs = () => {
  return read_file_with_header(
    './data/technical-test-jobs.csv',
    csv_to_jobs
  );
}

module.exports = {
  read_professions,
  read_jobs,
};
