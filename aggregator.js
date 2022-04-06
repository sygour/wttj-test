const data_provider = require('./data_provider')
const locator = require('./locator')

const find_profession = (job, professions) => {
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

const jobs_per_category_and_continent = async () => {
  return Promise.all([
    data_provider.read_jobs(),
    data_provider.read_professions()
  ]).then(promises => {
    const jobs = promises[0];
    const professions = promises[1];

    return Promise.all(
      jobs.map(job => (
        locator.get_continent(job.latitude, job.longitude)
          .then(continent => ({
              continent: continent,
              profession: find_profession(job, professions)
            })
          )
      ))
    ).then(infos => {
      const result = {};
      infos.map(info => {
        if (info.profession) {
          const category = info.profession.category_name;
          if (!result[category]) {
            result[category] = {};
          }
          if (!result['total']) {
            result['total'] = {
              total: 0
            };
          }
          increment(result[category], 'total');
          increment(result[category], info.continent);
          increment(result['total'], 'total');
          increment(result['total'], info.continent);
        }
      })
      return result;
    })
  })
}

module.exports = {
  jobs_per_category_and_continent,
};
