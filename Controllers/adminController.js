/**
 * Created by harekamsingh on 18/08/17.
 */
'use strict';
const {
    util
} = require('../Utilities');
const async = require('async');
const Services = require('../Services');
const config = require('../Config');
const {
    TokenManager
} = require('../Libraries');
const validator = require('validator');
const {
    SUCCESS_MESSAGES,
    ERROR_MESSAGES
} = config.RESPONSE_MESSAGES;
const constants = config.CONSTANTS;
const STATUS_CODE = constants.STATUS_CODE;

function registerAdmin(userDetails, payload, callbackRoute) {
    const password = util.generateRandomString(6, true);
    payload.createdByAdmin = userDetails.userData._id;
    async.auto({
        cipherPassword: (callback) => {
            if (payload.email) {
                if (!validator.isEmail(payload.email)) {
                    return callback(util.createErrorResponse(ERROR_MESSAGES.INVALID_EMAIL));
                }
            }
            util.cryptData(password, callback);
        },
        addAdmin: ['cipherPassword', (results, callback) => {
            payload.password = results.cipherPassword;
            Services.adminService.addNewAdmin(payload, callback);
        }]
    }, (err) => {
        if (err) return callbackRoute(util.createErrorResponse(err));
        return callbackRoute(null, util.createSuccessResponse(SUCCESS_MESSAGES.REGISTRATION_SUCCESSFUL, STATUS_CODE.CREATED, {
            password
        }));
    });
}

function loginAdmin(userDetails, payload, callbackRoute) {
    async.auto({
            findRecord: (callback) => {
                Services.adminService.fetchAdminDetails(payload, callback);
            },
            validate: ['findRecord', (results, callback) => {
                if (util.isEmpty(results.findRecord)) {
                    if (!validator.isEmail(payload.loginId))
                        return callback(ERROR_MESSAGES.LOGIN_ERROR_EMAIL);
                    return callback(ERROR_MESSAGES.LOGIN_ERROR_PHONE);
                }
                util.compareCryptData(payload.password, results.findRecord[0].password, (err, res) => {
                    if (err) return callback(err);
                    if (!res) return callback(ERROR_MESSAGES.INVALID_PASSWORD);
                    return callback(null);
                })
            }],
            token: ['validate', (results, callback) => {
                TokenManager.cipherToken({
                    _id: results.findRecord[0]._id,
                    userRole: results.findRecord[0].userRole,
                    createdAt: new Date(),
                    loginId: payload.loginId
                }, callback);
            }],
            update: ['token', (results, callback) => {
                Services.adminService.updateLoginDetails({
                    _id: results.findRecord[0]._id,
                    accessToken: results.token
                }, callback);
            }]
        },
        (err, results) => {
            if (err) return callbackRoute(util.createErrorResponse(err));
            return callbackRoute(null, util.createSuccessResponse(SUCCESS_MESSAGES.LOGIN_SUCCESSFULLY, STATUS_CODE.OK, {
                accessToken: results.token
            }));
        });
}

module.exports = {
    registerAdmin,
    loginAdmin
};