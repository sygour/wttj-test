const data_provider = require('./data_provider')
const jobs_per_category_and_continent = () => {
  return data_provider.read_jobs()
    .then(jobs => {
      const result = {
        professions: {
          total: 0,
        }
      };
      for (const job of jobs) {
        result.professions.total++;
      }
      return result;
    })
}

module.exports = {
  jobs_per_category_and_continent,
};
