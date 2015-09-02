(function () {
    'use strict';

    var datasources = {
      db: {
        name: 'db',
        connector: 'memory'
      },
      mongodb: {
        name: 'mongodb',
        connector: 'mongodb',
        host: process.env.host,
        port: process.env.port,
        url: process.env.url,
        database: process.env.database,
        password: process.env.password,
        user: process.env.user
      }
    };

    module.exports = datasources;
})();
