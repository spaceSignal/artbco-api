(function () {
    'use strict';

    var path = require('path');
    var habitat = require('habitat');
    var env = process.env['NODE_ENV'] || 'dev';
    var envFile = habitat.load(path.join(__dirname, env  + '.env'));

    if (envFile === false) {
        throw new Error('could not load an environment');
    }

    var api = envFile.get('api');
    var mongo = envFile.get('mongo');
    var rmq = envFile.get('rmq');

    var environment = {
        api: api,
        queue: {
            rmq: rmq
        },
        db: {
            mongo: mongo
        }
    };

    module.exports = environment;
})();
