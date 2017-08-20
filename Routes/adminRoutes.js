'use strict';
const adminController = require('../Controllers').adminController;
const config = require('../Config');
const constants = config.CONSTANTS;
const REGEX = constants.REGEX;
const util = require('../Utilities/util');
const Joi = require('joi');
const tags = ['api', 'user'];
const adminResponses = require('./adminResponses');
const notes = 'auth token should be in pattern(without quotes): "bearer access_token"';

const registerAdmin = {
    method: 'POST',
    path: '/api/v1/admin',
    config: {
        auth: 'adminAuth',
        notes,
        description: 'register new admin',
        tags,
        handler: (request, reply) => {
            const accessToken = request.auth && request.auth.credentials && request.auth.credentials.accessToken || null;
            const userData = request.auth && request.auth.artifacts || null;
            adminController.registerAdmin({
                userData,
                accessToken
            }, request.payload, (error, success) => {
                if (error)
                    return reply(error.response).code(error.statusCode);
                return reply(success.response).code(success.statusCode);

            });
        },
        validate: {
            headers: util.authorizeHeaderObject,
            payload: {
                firstName: Joi.string().required().trim().regex(REGEX.ALPHABET_ONLY),
                lastName: Joi.string().required().trim().regex(REGEX.ALPHABET_ONLY),
                email: Joi.string().required().trim().email(),
                phoneNumber: Joi.string().required().trim().regex(REGEX.PHONE_NUMBER).length(constants.PHONE_NUM_LEN),
                userRole: Joi.string().required().valid(
                    constants.USER_ROLE.ADMIN,
                    constants.USER_ROLE.SUPER_ADMIN
                )
            },
            failAction: util.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responses: adminResponses.registerSuccessResponse
            }
        }

    }
};

const loginAdmin = {
    method: 'POST',
    path: '/api/v1/admin/login',
    config: {
        description: 'loginAdmin',
        tags,
        handler: (request, reply) => {
            const accessToken = request.auth && request.auth.credentials && request.auth.credentials.accessToken || null;
            const userData = request.auth && request.auth.artifacts || null;
            adminController.loginAdmin({
                userData,
                accessToken
            }, request.payload, (error, success) => {

                if (error)
                    return reply(error.response).code(error.statusCode);

                return reply(success.response).code(success.statusCode);

            });
        },
        validate: {
            payload: {
                loginId: Joi.string().required().trim().description("email or phone number"),
                password: Joi.string().required().trim().min(constants.PASSWORD_MIN_LEN).max(constants.PASSWORD_MAX_LEN)
            },
            failAction: util.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responses: adminResponses.loginSuccessResponse
            }
        }

    }
};
module.exports = [
    registerAdmin,
    loginAdmin
];