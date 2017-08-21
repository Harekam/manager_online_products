/**
 * Created by harekamsingh on 18/08/17.
 */
'use strict';
const http = require("http");
const config = require('./Config');
const constants = config.CONSTANTS;
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
const mongoose = require('mongoose');
const {
    REGEX,
    CONTENT_BOUNDS
} = constants;
const httpUrl = require('url');
const async = require('async');
const formidable = require('formidable');
const _ = require('lodash');
const {
    productController,
    adminController
} = require('./Controllers');
const {
    util
} = require('./Utilities');
const Joi = require('joi');
const {
    API_PATH,
    PORT
} = config.serverConfig;

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
    let payload = {};
    if (!headers["content-type"])
        headers["content-type"] = "application/json";
    if (headers["content-type"] !== "application/json") {
        response.writeHead(400, {
            'content-type': 'application/json'
        });
        response.end(JSON.stringify({
            message: "Only application/json content-type is accepted."
        }));
        return;
    }

    // const val = API_PATH.UPDATE_PRODUCT.pattern(); //val.ast[].tag=static&value=pathname
    for (let route in API_PATH) {
        if (API_PATH.hasOwnProperty(route)) {
            let routeMethod = API_PATH[route].method;
            if ((routeMethod === "PUT" || routeMethod === "DELETE") && API_PATH[route].pattern) {
                params = API_PATH[route].pattern().match(pathname);
                if (params) {
                    pathname = API_PATH[route].path;
                    break;
                }
            }
        }
    }
    const form = new formidable.IncomingForm();
    switch (`${pathname} | ${method}`) {
        case `${API_PATH.CREATE_PRODUCT.path} | ${API_PATH.CREATE_PRODUCT.method}`:
            form.parse(request, function (err, fields) {
                if (err) {
                    response.writeHead(400, {
                        'Content-Type': 'application/json'
                    });
                    response.end(JSON.stringify({
                        message: API_PATH.CREATE_PRODUCT.path
                    }));
                    return;
                }

                response.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                response.end(JSON.stringify(fields));
            });
            break;
        case `${API_PATH.UPDATE_PRODUCT.path} | ${API_PATH.UPDATE_PRODUCT.method}`:
            const schema = {
                params: {
                    productId: Joi.string().required().trim().regex(REGEX.OBJECT_ID)
                },
                payload: {
                    productName: Joi.string().optional().trim().min(CONTENT_BOUNDS.name.min).max(CONTENT_BOUNDS.name.max),
                    description: Joi.string().optional().trim().min(CONTENT_BOUNDS.description.min).max(CONTENT_BOUNDS.description.max),
                    totalStock: Joi.number().optional().integer(),
                    totalSold: Joi.number().optional().integer(),
                    price: Joi.number().optional().positive(),
                    discount: Joi.number().optional().min(0),
                    salePrice: Joi.number().optional().positive(),
                    brand: Joi.string().optional().trim().min(CONTENT_BOUNDS.name.min).max(CONTENT_BOUNDS.name.max),
                    isAvailable: Joi.boolean().optional()
                }
            };
            async.auto({
                validateHeaders: (callback) => {
                    Joi.validate(headers, util.authorizeHeaderObject, (err, res) => {
                        if (err) return callback(util.createErrorResponse("Access Denied", 401));
                        const tokenDetails = res.authorization.split(" ");
                        if (tokenDetails[0] !== "bearer")
                            return callback(util.createErrorResponse("Access Denied", 401));
                        const scope = new Set();
                        scope.add(constants.USER_ROLE.ADMIN);
                        scope.add(constants.USER_ROLE.SUPER_ADMIN);
                        return util.authorizeUser({
                            accessToken: tokenDetails[1],
                            scope
                        }, callback);
                    });
                },
                parseForm: ['validateHeaders', (results, callback) => {
                    jsonParser(request, response, (err, res) => {
                        if (err) {
                            return callback(err);
                        }
                        payload = request.body;
                        return callback(null, request.body);
                    })
                    // form.parse(request, function (err, fields, files) {
                    //     if (err) return callback(err);
                    //     payload = fields;
                    //     return callback(null);
                    // });
                }],
                validateParams: ['validateHeaders', (results, callback) => {
                    Joi.validate(params, schema.params, (err, res) => {
                        if (err) {
                            return callback(util.failActionFunction(err));
                        }
                        params = res;
                        return callback(null);
                    });
                }],
                validatePayload: ['parseForm', (results, callback) => {
                    Joi.validate(payload, schema.payload, (err, res) => {
                        if (err) {
                            return callback(util.failActionFunction(err));
                        }
                        payload = res;
                        return callback(null);
                    });
                }],
                process: ['validatePayload', 'validateParams', (results, callback) => {
                    productController.updateProduct({
                        userData: results.validateHeaders
                    }, Object.assign({}, payload, params), callback);
                }]
            }, (error, success) => {
                if (error) {
                    if (!_.isObject(error) ||
                        (_.isObject(error) &&
                            (!error.hasOwnProperty('statusCode') || !error.hasOwnProperty('response')))) {
                        error = util.createErrorResponse(error);
                    }
                    response.writeHead(error.statusCode, {
                        'Content-Type': 'application/json'
                    });
                    response.end(JSON.stringify(error.response));
                    return;
                }
                success = success.process;
                if (!_.isObject(success) ||
                    (_.isObject(success) &&
                        (!success.hasOwnProperty('statusCode') || !success.hasOwnProperty('response')))) {
                    success = util.createSuccessResponse(success);
                }
                response.writeHead(success.statusCode, {
                    'Content-Type': 'application/json'
                });
                response.end(JSON.stringify(success.response));
                return;
            });
            break;
        case `${API_PATH.DELETE_PRODUCT.path} | ${API_PATH.DELETE_PRODUCT.method}`:
            form.parse(request, function (err, fields) {
                if (err) {
                    response.writeHead(400, {
                        'Content-Type': 'application/json'
                    });
                    response.end(JSON.stringify({
                        message: API_PATH.CREATE_PRODUCT.path
                    }));
                    return;
                }

                response.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                response.end(JSON.stringify(fields));
            });
            break;
        case `${API_PATH.GET_PRODUCT.path} | ${API_PATH.GET_PRODUCT.method}`:
            response.writeHead(200, {
                'Content-Type': 'application/json'
            });
            response.end(JSON.stringify({
                message: API_PATH.GET_PRODUCT.path
            }));
            break;
        case `${API_PATH.CREATE_ADMIN.path} | ${API_PATH.CREATE_ADMIN.method}`:
            response.writeHead(200, {
                'Content-Type': 'application/json'
            });
            response.end(JSON.stringify({
                message: API_PATH.CREATE_ADMIN.path
            }));
            break;
        case `${API_PATH.LOGIN_ADMIN.path} | ${API_PATH.LOGIN_ADMIN.method}`:
            response.writeHead(200, {
                'Content-Type': 'application/json'
            });
            response.end(JSON.stringify({
                message: API_PATH.LOGIN_ADMIN.path
            }));
            break;
        default:
            response.writeHead(404, {
                'Content-Type': 'application/json'
            });
            response.end(JSON.stringify({
                message: "404 error! not found"
            }));
            break;
    }
    console.log("Request received.");
}
mongoose.Promise = global.Promise; //mongoose warning fix
const MONGO_DB_URI = config.dbConfig.mongodbURI;
mongoose.connect(MONGO_DB_URI, (err) => {
    if (err) {
        console.log("DB Error: ", err);
        process.exit(1);
    }
    console.log('MongoDB Connected at', MONGO_DB_URI);
});
setTimeout(() => {
    http.createServer(onRequest).listen(PORT);
    console.log("Server has started.");
}, 5000);