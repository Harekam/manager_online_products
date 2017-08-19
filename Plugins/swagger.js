'use strict';
/**
 * Created by harekam on 18/08/17.
 */

//Register Swagger
const pack = require('../package');
const swaggerOptions = {
    info: {
        title: pack.description,
        version: pack.version
    },
    pathPrefixSize: 3
};

exports.register = function (server, options, next) {

    server.register({
        register: require('hapi-swagger'),
        options: swaggerOptions
    }, (err) => {
        if (err) {
            server.log(['error'], 'hapi-swagger load error: ' + err)
        } else {
            server.log(['start'], 'hapi-swagger interface loaded')
        }
    });

    next();
};

exports.register.attributes = {
    name: 'swagger-plugin'
};