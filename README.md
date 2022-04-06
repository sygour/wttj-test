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

### Separating read and write

We could also separate reading and writing in 2 different apps:

The 1st would:
- receive new jobs
- find its location
- store in Db

The 2nd would:
- read Db with a dedicated query

With this architecture, we can scale our applications regarding its usage:
- if we get way more jobs: increase the number of job-receiver app running in parallel
- if we get more queries: increase the number of job-research app running in parallel

## 3. API implementation

This aggregation could be a basis for job research and refinement.

### API users

The first aspect we need to design/define is the data we want to show our users:
- it can be people looking for a job
- it can also be an internal team looking for a way to visualize our current data

Depending on the user, we may show more/less info in our JSON model. I will assume it is aimed at people looking for a job.

### Base

Our base API endpoint would be:
```http request
GET /jobs
```

But it would not be really RESTful to present an aggregation on this endpoint: it would be more a list of jobs. For example the latest jobs with these default filters:
```http request
GET /jobs?page=0&issue_date=desc
===
{
  data: [], // array of jobs
  page: {
    number: 0,
    page_count: n,
    element_per_page: m
  }
}
```

As the number of jobs is supposed to increase, it seems logical to paginate the results.

### Aggregation

We still want to provide a way to show data aggregation:
```http request
GET /jobs?view_type=aggregation
```

As well, we could offer a closer look, per country of a continent for example:
```http request
GET /jobs?view_type=aggregation&continent=europe
```

### Filters

#### Location

As we were aggregating per continent, we could also provide jobs listing per location:
```http request
GET /jobs?continent=europe
GET /jobs?continent=europe&country=germany
GET /jobs?continent=europe&country=germany&city=berlin
```

#### Job category

Job category is a useful filter as well:
```http request
GET /jobs?category=Tech
```

#### Job name

The name of the job would also be interesting to compare offer that are similar:
```http request
GET /jobs?name="bras droit"
```
This one would require a match on the name string `name ilike 'bras droit'`. We should also be careful at properly escaping characters to avoid SQL injections.
