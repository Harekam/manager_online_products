'use strict';
/**
 * Created by harekam on 18/08/17.
 */

const util = require('../Utilities/util');
const constants = require('../Config').CONSTANTS;
exports.register = function (plugin, options, next) {
    plugin.register(require('hapi-auth-bearer-token'), (err) => {
        if (err) return next(err);
        plugin.auth.strategy('adminAuth', 'bearer-access-token', {
            allowQueryToken: false, // optional, true by default
            allowMultipleHeaders: false, // optional, false by default
            accessTokenName: 'access_token', // optional, 'access_token' by default
            validateFunc: validateAdminToken
        });
        plugin.auth.strategy('superAdminAuth', 'bearer-access-token', {
            allowQueryToken: false, // optional, true by default
            allowMultipleHeaders: false, // optional, false by default
            accessTokenName: 'access_token', // optional, 'access_token' by default
            validateFunc: validateSuperAdminToken
        });
    });
    next();
}

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
exports.register.attributes = {
    name: 'authentication',
    "description": "This is the authentication provider"
};