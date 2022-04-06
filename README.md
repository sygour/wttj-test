# WTJJ backend technical test

## Grouping data per continent

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
