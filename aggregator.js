const data_provider = require('./data_provider')

const find_category = (job, professions) => {
  const match = professions
    .filter(profession => profession.id === job.profession_id);
  if (match && match.length > 0) {
    return match[0];
  }
}

const increment_category = (result, job, professions) => {
  const category = find_category(job, professions)
  if (category) {
    const name = category.category_name;
    const count = result.professions[name] ? result.professions[name] : 0;
    result.professions[name] = count + 1;
  }
}

const jobs_per_category_and_continent = () => {
  return Promise.all([
    data_provider.read_jobs(),
    data_provider.read_professions()
  ]).then(promises => {
    const jobs = promises[0];
    const professions = promises[1];

    const result = {
      professions: {
        total: 0,
      }
    };
    for (const job of jobs) {
      result.professions.total++;
      increment_category(result, job, professions)
    }
    return result;
  })
}

module.exports = {
  jobs_per_category_and_continent,
};
