const aggregator = require('./aggregator');
const locator = require('./locator');
const Table = require("cli-table");

aggregator.jobs_per_category_and_continent()
  .then(aggregation => {
    const row_titles = ['total']
      .concat(...locator.continents);
    const column_titles = ['total']
    for (const category in aggregation) {
      if (category !== 'total') {
        column_titles.push(category);
      }
    }
    console.log(
      'cols', column_titles,
      'rows', row_titles
    );

    const head = [''].concat(column_titles);
    const table = new Table({head: head});
    for (const continent of row_titles) {
      const row = {}
      row[continent] = column_titles.map(category => {
        return aggregation[category][continent];
      });
      table.push(row);
    }

    console.log(table.toString());
  })
