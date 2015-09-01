module.exports = function logger (server) {
    var logger = require('morgan');

    server.use(logger('dev'));
};
