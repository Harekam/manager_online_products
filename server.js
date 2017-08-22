/**
 * Created by harekamsingh on 18/08/17.
 */
'use strict';
const http = require("http");
const config = require('./Config');
const constants = config.CONSTANTS;
const STATUS_CODE = constants.STATUS_CODE;
const DEFAULT_CONTENT_TYPE = constants.DEFAULT_CONTENT_TYPE;
const {
    ERROR_MESSAGES
} = config.RESPONSE_MESSAGES;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
const httpUrl = require('url');
const async = require('async');
const Joi = require('joi');
const Path = require('path');
const fs = require('fs');
const {
    API_PATH,
    PORT
} = config.serverConfig;
const MONGO_DB_URI = config.dbConfig.mongodbURI;
const {authenticate} = require('./Plugins');
const Routes = require('./Routes');
const {bootstrap, util} = require('./Utilities');
Routes.push({
    method: 'GET',
    path: '/',
    config: {
        handler: function (request, reply) {
            return reply(null, 'Welcome to Manager online products!');
        }
    }
}, {
    method: 'GET',
    path: '/dbSchema',
    config: {
        handler: function (request, reply) {
            reply(null, 'db_schema.html', {isFile: true});
        }
    }
});
const routeMap = new Map();

for (let i = 0, len = Routes.length; i < len; i++) {
    if (!Routes[i].config || (Routes[i].config && !Routes[i].config.handler))
        throw new Error("Invalid route options");
    const key = `${Routes[i].path} | ${Routes[i].method}`;
    if (routeMap.has(key)) {
        throw new Error("Route path already exists");
    } else {
        routeMap.set(key, i);
    }
}
const httpServer = http.createServer(onRequest);

function onRequest(request, response) {
    const {
        url,
        method,
        headers
    } = request;
    let {
        pathname,
        query
    } = httpUrl.parse(url, true);
    let params = {};
    if (!headers["content-type"])
        headers["content-type"] = DEFAULT_CONTENT_TYPE;
    if (headers["content-type"] !== DEFAULT_CONTENT_TYPE) {
        response.writeHead(STATUS_CODE.BAD_REQUEST, {
            'content-type': DEFAULT_CONTENT_TYPE
        });
        response.end(JSON.stringify({
            message: ERROR_MESSAGES.INVALID_CONTENT_TYPE
        }));
        return;
    }

    // const val = API_PATH.UPDATE_PRODUCT.pattern(); //val.ast[].tag=static&value=pathname
    for (let route in API_PATH) {
        if (API_PATH.hasOwnProperty(route)) {
            let routeMethod = API_PATH[route].method;
            if (method === routeMethod && (routeMethod === "PUT" || routeMethod === "DELETE") && API_PATH[route].pattern) {
                params = API_PATH[route].pattern().match(pathname);
                if (params) {
                    pathname = API_PATH[route].path;
                    break;
                }
            }
        }
    }
    const key = `${pathname} | ${method}`;
    if (!routeMap.has(key)) {
        response.writeHead(STATUS_CODE.NOT_FOUND, {
            'content-type': DEFAULT_CONTENT_TYPE
        });
        response.end(JSON.stringify({
            message: ERROR_MESSAGES.NOT_FOUND
        }));
        return;
    }
    const requestedRoute = Routes[routeMap.get(key)];
    const failAction = (requestedRoute.config.validate && requestedRoute.config.validate.failAction) || util.failActionFunction;
    request.params = params;
    request.query = query;
    async.auto({
        auth: (callback) => {
            if (!requestedRoute.config.auth)
                return callback(null);
            return authenticate.authMiddleware(request, requestedRoute, callback);
        },
        parseForm: ['auth', (results, callback) => {
            if (!requestedRoute.config.validate || (requestedRoute.config.validate && !requestedRoute.config.validate.payload))
                return callback(null);
            jsonParser(request, response, (err) => {
                if (err) {
                    return callback(err);
                }
                request.payload = request.body;
                return callback(null, request.payload);
            })
        }],
        validateParams: ['auth', (results, callback) => {
            if (!requestedRoute.config.validate || (requestedRoute.config.validate && !requestedRoute.config.validate.params))
                return callback(null);
            Joi.validate(request.params, requestedRoute.config.validate.params, (err, res) => {
                if (err) {
                    return callback(failAction(err));
                }
                request.params = res;
                return callback(null);
            });
        }],
        validateQuery: ['auth', (results, callback) => {
            if (!requestedRoute.config.validate || (requestedRoute.config.validate && !requestedRoute.config.validate.query))
                return callback(null);
            Joi.validate(request.query, requestedRoute.config.validate.query, (err, res) => {
                if (err) {
                    return callback(failAction(err));
                }
                request.query = res;
                return callback(null);
            });
        }],
        validatePayload: ['parseForm', (results, callback) => {
            if (!requestedRoute.config.validate || (requestedRoute.config.validate && !requestedRoute.config.validate.payload))
                return callback(null);
            Joi.validate(request.payload, requestedRoute.config.validate.payload, (err, res) => {
                if (err) {
                    return callback(failAction(err));
                }
                request.payload = res;
                return callback(null);
            });
        }],
        process: ['validatePayload', 'validateParams', 'validateQuery', (results, callback) => {
            requestedRoute.config.handler(request, callback);
        }]
    }, (err, res) => {
        let responseObject = res.process;
        let options = {};
        if (Array.isArray(res.process)) {
            responseObject = res.process[0];
            options = res.process[1];
        }
        if (err) {
            responseObject = util.createErrorResponse(err);
        }
        if (typeof responseObject === "string") {
            if (options.isFile) {
                let filePath = Path.join(__dirname, 'Public', responseObject);
                let stats;
                try {
                    stats = fs.lstatSync(filePath);
                } catch (e) {
                    response.writeHead(STATUS_CODE.NOT_FOUND, {
                        'content-type': DEFAULT_CONTENT_TYPE
                    });
                    response.end(JSON.stringify({
                        message: ERROR_MESSAGES.NOT_FOUND
                    }));
                    return;
                }
                if (stats.isFile()) {
                    let mimeType = constants.MIME_TYPES[Path.extname(filePath).split(".").reverse()[0]];
                    response.writeHead(200, {'Content-Type': mimeType});
                    fs.createReadStream(filePath).pipe(response);
                } else {
                    response.writeHead(STATUS_CODE.SERVER_ERROR, {
                        'Content-Type': DEFAULT_CONTENT_TYPE
                    });
                    response.end(JSON.stringify({
                        message: ERROR_MESSAGES.SERVER_ERROR
                    }));
                }

            } else {
                response.writeHead(STATUS_CODE.OK, {
                    'Content-Type': constants.MIME_TYPES.text
                });
                response.end(responseObject);
            }
            return;

        }
        response.writeHead(responseObject.statusCode, {
            'Content-Type': DEFAULT_CONTENT_TYPE
        });
        response.end(JSON.stringify(responseObject.response));
        return;
    });
}

mongoose.Promise = global.Promise; //mongoose warning fix
async.auto({
    db: (callback) => {
        mongoose.connect(MONGO_DB_URI, callback);
    },
    bootstrap: ['db', (results, callback) => {
        bootstrap.bootstrapAdmin(callback);
    }],
    init: ['bootstrap', (results, callback) => {
        httpServer.listen(PORT, callback)
    }]
}, (err) => {
    if (err) {
        console.error("Error: ", err);
        process.exit(1);
    }
    console.log('MongoDB Connected at', MONGO_DB_URI);
    console.log(`Server started on port ${PORT}`);
});
module.exports = httpServer;