'use strict';
const adminController = require('../Controllers').adminController;
const config = require('../Config');
const constants = config.CONSTANTS;
const {
    REGEX,
    CONTENT_BOUNDS
} = constants;
const util = require('../Utilities/util');
const Joi = require('joi');

const registerAdmin = {
    method: 'POST',
    path: '/api/v1/admin',
    config: {
        auth: 'adminAuth',
        handler: (request, reply) => {
            const accessToken = request.auth && request.auth.credentials && request.auth.credentials.accessToken || null;
            const userData = request.auth && request.auth.artifacts || null;
            adminController.registerAdmin({
                userData,
                accessToken
            }, request.payload, (error, success) => {
                if (error)
                    return reply(error);
                return reply(null, success);
            });
        },
        validate: {
            headers: util.authorizeHeaderObject,
            payload: {
                firstName: Joi.string().required().trim().regex(REGEX.ALPHABET_ONLY).min(CONTENT_BOUNDS.name.min).max(CONTENT_BOUNDS.name.max),
                lastName: Joi.string().required().trim().regex(REGEX.ALPHABET_ONLY).min(CONTENT_BOUNDS.name.min).max(CONTENT_BOUNDS.name.max),
                email: Joi.string().required().trim().email().min(CONTENT_BOUNDS.email.min).max(CONTENT_BOUNDS.email.max),
                phoneNumber: Joi.string().required().trim().regex(REGEX.PHONE_NUMBER).length(CONTENT_BOUNDS.phone.max),
                userRole: Joi.string().required().valid(
                    constants.USER_ROLE.ADMIN,
                    constants.USER_ROLE.SUPER_ADMIN
                )
            },
            failAction: util.failActionFunction
        }
    }
};

const loginAdmin = {
    method: 'POST',
    path: '/api/v1/admin/login',
    config: {
        handler: (request, reply) => {
            const accessToken = request.auth && request.auth.credentials && request.auth.credentials.accessToken || null;
            const userData = request.auth && request.auth.artifacts || null;
            adminController.loginAdmin({
                userData,
                accessToken
            }, request.payload, (error, success) => {
                if (error)
                    return reply(error);
                return reply(null, success);
            });
        },
        validate: {
            payload: {
                loginId: Joi.string().required().trim().description("email or phone number").min(CONTENT_BOUNDS.email.min).max(CONTENT_BOUNDS.email.max),
                password: Joi.string().required().trim().min(CONTENT_BOUNDS.password.min).max(CONTENT_BOUNDS.password.max)
            },
            failAction: util.failActionFunction
        }
    }
};
module.exports = [
    registerAdmin,
    loginAdmin
];