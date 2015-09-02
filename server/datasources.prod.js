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
        host: process.env.mongo_host,
        port: process.env.mongo_port,
        url: process.env.mongo_url,
        database: process.env.mongo_database,
        password: process.env.mongo_password,
        user: process.env.mongo_user
      }
    };

    module.exports = datasources;
})();
