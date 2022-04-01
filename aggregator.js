const data_provider = require('./data_provider')
const locator = require('./locator')

const find_category = (job, professions) => {
  const match = professions
    .filter(profession => profession.id === job.profession_id);
  if (match && match.length > 0) {
    return match[0];
  }
}

const increment = (result, attribute) => {
  const count = result[attribute] ? result[attribute] : 0;
  result[attribute] = count + 1;
}

const increment_category = (result, job, professions) => {
  const category = find_category(job, professions)
  if (category) {
    increment(result, category.category_name);
  }
}

const continent_aggregation = async (jobs) => {
  return Promise.all(
    jobs.map(job => locator.get_continent(job.latitude, job.longitude))
  ).then(continents => {
    const result = {
      total: continents.length
    };
    continents.map(continent => {
      increment(result, continent);
    });
    return result
  });
}

const category_aggregation = (jobs, professions) => {
  const result = {
    total: jobs.length,
  };
  for (const job of jobs) {
    increment_category(result, job, professions)
  }
  return result;
}

const jobs_per_category_and_continent = async () => {
  return Promise.all([
    data_provider.read_jobs(),
    data_provider.read_professions()
  ]).then(promises => {
    const jobs = promises[0];
    const professions = promises[1];

    return Promise.all([
      category_aggregation(jobs, professions),
      continent_aggregation(jobs)
    ]).then(aggregations => ({
      categories: aggregations[0],
      continents: aggregations[1]
    }));
  })
}

module.exports = {
  jobs_per_category_and_continent,
};
