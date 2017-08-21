'use strict';
/**
 * Created by harekam on 18/08/17.
 */

const util = require('../Utilities/util');
const config = require('../Config');
const constants = config.CONSTANTS;
const STATUS_CODE = constants.STATUS_CODE;
const {
    ERROR_MESSAGES
} = config.RESPONSE_MESSAGES;
const Joi = require('joi');
const async = require('async');

function validateSuperAdminToken(token, callback) {
    // For convenience, the request object can be accessed
    // from `this` within validateFunc.
    //var request = this;
    validateSessionKey({
        accessToken: token,
        scope: new Set().add(constants.USER_ROLE.SUPER_ADMIN)
    }, callback);
}

function validateAdminToken(token, callback) {

    // For convenience, the request object can be accessed
    // from `this` within validateFunc.
    //var request = this;
    const scope = new Set();
    scope.add(constants.USER_ROLE.ADMIN);
    scope.add(constants.USER_ROLE.SUPER_ADMIN);
    validateSessionKey({
        accessToken: token,
        scope
    }, callback);
}

function validateSessionKey(details, callback) {
    if (details && details.accessToken) {
        return util.authorizeUser(details, (error, res) => {
            if (error) {
                return callback(null, false, details);
            }
            return callback(null, true, details, res);
        });
    }
    return callback(null, false, details);
}

const middleware = {
    "adminAuth": validateAdminToken,
    "superAdminAuth": validateSuperAdminToken
};

function authMiddleware(request, route, callbackParent) {
    const authStrategy = route.config.auth;
    if (!middleware[authStrategy]) throw new Error("Invalid auth strategy");
    async.waterfall([
        (callback) => {
            Joi.validate(request.headers, route.config.validate.headers || util.authorizeHeaderObject, callback);
        },
        (res, callback) => {
            const tokenDetails = res.authorization.split(" ");
            if (tokenDetails[0] !== "bearer")
                return callback(util.createErrorResponse(ERROR_MESSAGES.ACCESS_DENIED, STATUS_CODE.UNAUTHORIZED));
            const scope = new Set();
            scope.add(constants.USER_ROLE.ADMIN);
            scope.add(constants.USER_ROLE.SUPER_ADMIN);
            middleware[authStrategy](tokenDetails[1], (err, isValid, credentials, artifacts) => {
                if (err || !isValid) return callback(true);
                return callback(null, {credentials, artifacts});
            });
        }
    ], (err, res) => {
        if (err) return callbackParent(util.createErrorResponse(ERROR_MESSAGES.ACCESS_DENIED, STATUS_CODE.UNAUTHORIZED));
        request.auth = res;
        return callbackParent(null);
    });
}

module.exports = {
    authMiddleware
};