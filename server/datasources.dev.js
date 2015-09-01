(function () {
    'use strict';

    var config = require('../common/config');

    var datasources = {
      db: {
        name: 'db',
        connector: 'memory'
      },
      mongodb: {
        name: 'mongodb',
        host: config.db.mongo.host,
        port: config.db.mongo.port,
        url: config.db.mongo.uri,
        database: config.db.mongo.dbname,
        password: config.db.mongo.password,
        user: config.db.mongo.username,
        connector: 'mongodb'
      }
    };

    module.exports = datasources;
})();
