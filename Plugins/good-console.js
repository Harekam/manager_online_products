'use strict';
/**
 * Created by harekam on 18/08/17.
 */
const Good = require('good');

//Register Good Console

exports.register = function (server, options, next) {

    server.register({
        register: Good,
        options: {
            reporters: {
                console: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{
                        log: '*',
                        error: '*',
                        response: '*'
                    }]
                }, {
                    module: 'good-console'
                    }, 'stdout']
            }
        }
    }, (err) => {
        if (err) {
            throw err;
        }
    });

    next();
};

exports.register.attributes = {
    name: 'good-console-plugin'
};