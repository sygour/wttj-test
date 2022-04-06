# WTJJ backend technical test

## 1. Grouping data per continent

### How to run it?

```shell
node start.js
```

### Project structure

- `starter.js`: deals with the display part. It uses cli-table library to display aggregation data as disired table
- `aggregator.js`: retrieves job description and location and aggregate them per category and continent
- `data_provider.js`: acts as a repository but read from given csv files
- `locator.js`: provides a function to get continent from latitude and longitude, as well as an array containing all the continents.

### Run tests

```shell
npm test
```

Unit tests are written using Jest library.

## Known limitations and possible enhancements

### CSV parsing

I started naively parsing the csv separating new line symbols and comas but some of the entries requires a further parsing (escaping some characters).

A possible solution, would be to use a parser module, example: [CSV module](https://csv.js.org/parse/)

### Reverse Geocoding

The locator service currently returns a random continent, which allowed me to implement the display part easily, obviously this need to be changed. Two possibilities for this:
- using an API like geoapify.com or opencagedata.com
- using a library like [Geojson-places](https://github.com/rapomon/geojson-places)

I started exploring the second part and pushed it on another branch, but this is not a complete job. Here is a quick look at the changes involved:

- `locator.js`
```js
const geo_json_places = require("geojson-places");

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
```

- `aggregator.js`
```js
const jobs_per_category_and_continent = async () => {
  return Promise.all([
    data_provider.read_jobs(),
    data_provider.read_professions()
  ]).then(promises => {
    const jobs = promises[0];
    const professions = promises[1];

    const infos = [];
    for (const job of jobs) {
      const continent = locator.get_continent(job.office_latitude, job.office_longitude)
      if (continent) {
        infos.push({
          continent: continent,
          profession: find_profession(job, professions)
        });
      } else {
        console.error('cannot find location for job: ', JSON.stringify(job));
      }
    }

    const result = {};
    infos.forEach(info => {
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
}
```

### Performance issue

Since we are calling a third party service to find the location and this operation can take some times, these calls will eventually have to be parallelized and maybe done in batch to make this more performant and robust.

## 2. Scaling

### Hypothesis:
> 100 000 000 job offers in our database
> 
> 1000 new job offers per second

### Using a geographic database (example PostGIS)

One way would be to delegate the job of finding the continent to a database designed for this purpose (ex. PostGIS)

Then we can have 2 different apps (or worker/thread if we stay in the same application):
- the first one storing jobs in database
- the second one reading jobs in each different regions

For this purpose, we would have to configure:
- the boundaries of the continents in PostGIS
- maybe adding indexes on latitude/longitude would be required (I never worked intensively with this kind of Db)

### Using async communication and a message broker

Another way would be to have 2 applications communicating through a message broker (ex. Kafka, RabbitMQ)

The 1st one would:
- receive new job
- get the location (from an API/module)
- send a message containing job info and location over the broker

The 2nd one would:
- get messages from the broker
- store the info in Db
- provide an aggregation query: this one is simpler since there is no location to find and can be done with a dedicated SQL query.

The 2nd app write and read should be done in 2 different worker/thread to make it more performant, since the load on write part will increase.

With this Db model, we can even have many Db writer and consider this job table as an append-only table.

## 3. API implementation


