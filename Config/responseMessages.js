/**
 * Created by harekam on 18/08/17.
 */
'use strict';
const CONSTANTS = require('./constants');
let Joi = require('joi');

const ERROR_MESSAGES = {
    'SOMETHING_WRONG': 'Something went wrong.',
    'INVALID_REQUEST': 'Invalid Request.',
    'INVALID_TIMEZONE': 'Invalid timezone.',
    'DATA_NOT_FOUND': 'Data not found.',
    'NO_DATA_UPDATED': 'No data updated.',
    'PARAMETER_MISSING': 'Parameters missing.',
    'WRONG_PARAMETER': 'Wrong parameter.',
    'UPLOAD_ERROR': 'Error in uploading.',
    'DUPLICATE_ENTRY': 'Duplicate Entry.',
    'DUPLICATE_EMAIL': 'Duplicate email id.',
    'DUPLICATE_PHONE': 'Duplicate phone number.',
    'INVALID_ID': 'Invalid ID.',
    'INVALID_REQUEST_ID': 'Invalid request id.',
    'INVALID_GROUP_ID': 'Invalid group ID.',
    'PHONE_NUMBER_ALREADY_EXISTS': 'Phone number already exists.',
    'USERNAME_ALREADY_EXISTS': 'Username already exists.',
    'PHONE_NUMBER_NOT_EXISTS': 'Phone number does not exists.',
    'EMAIL_NOT_EXISTS': 'Email does not exists.',
    'USERNAME_NOT_EXISTS': 'Username does not exists.',
    'EMAIL_ALREADY_EXISTS': 'Email already exists.',
    'LOGIN_ERROR': 'Invalid credentials.',
    'USER_NOT_FOUND': 'User not found.',
    'INVALID_PASSWORD': 'Invalid password.',
    'LOGIN_ERROR_EMAIL': 'This email address does not exists in our records.',
    'LOGIN_ERROR_PHONE': 'This phone number does not exists in our records.',
    'USER_BLOCKED': 'You have been blocked by admin please contact support.',
    'ERROR_ON_REGISTER_ADMIN': 'An error occurred while registering the admin, please try again later.',
    'ACCESS_DENIED': 'Access Denied.',
    'INVALID_CONTENT_TYPE': 'Only application/json content-type is accepted.',
    'NOT_FOUND': 'Error 404! not found',
    'SERVER_ERROR': 'Internal server error',
    'NOTIFY_FAIL': 'Notification fail.',
    'ACTION_NOT_ALLOWED': 'You are not allowed to perform this action.',
    'ALREADY_BLOCKED': 'User already blocked.',
    'INVALID_DATE': 'Invalid date.',
    'INVALID_DATA': 'Invalid data.',
    'ALREADY_UNBLOCKED': 'User already unblocked.',
    'INVALID_EMAIL': "Invalid email id.",
    'INVALID_USER_ID': "Invalid user id.",
    'INVALID_USER_NAME': "Invalid user name.",
    'ACTION_NO_AUTH': "You are not authorize to perform this action.",
    'REQUEST_NOT_PROCESSED': "Request could not be processed."
};
const SUCCESS_MESSAGES = {
    'REGISTRATION_SUCCESSFUL': 'Admin successfully registered.',
    'PASSWORD_RESET_SUCCESS': 'Password reset successfully.',
    'DETAILS_SUBMITTED': 'Details submitted successfully.',
    'SUCCESSFULLY_ADDED': 'Successfully added.',
    'SUCCESSFULLY_UPLOADED': 'Successfully uploaded.',
    'ACTION_COMPLETE': 'Action complete.',
    'LOGIN_SUCCESSFULLY': 'Logged in successfully.',
    'LOGOUT_SUCCESSFULLY': 'Logged out successfully.',
    'VALID_REQUEST': 'Valid request.'
};
const CUSTOM_STATUS_CODES = {
    DEFAULT: 0
};
let SWAGGER_DEFAULT_RESPONSE_MESSAGES = {};
SWAGGER_DEFAULT_RESPONSE_MESSAGES[CONSTANTS.STATUS_CODE.OK] = {
    'description': 'OK'
};
SWAGGER_DEFAULT_RESPONSE_MESSAGES[CONSTANTS.STATUS_CODE.CREATED] = {
    'description': 'Created'
};
SWAGGER_DEFAULT_RESPONSE_MESSAGES[CONSTANTS.STATUS_CODE.BAD_REQUEST] = {
    'description': 'Bad Request'
};
SWAGGER_DEFAULT_RESPONSE_MESSAGES[CONSTANTS.STATUS_CODE.UNAUTHORIZED] = {
    'description': 'Unauthorized'
};
SWAGGER_DEFAULT_RESPONSE_MESSAGES[CONSTANTS.STATUS_CODE.NOT_FOUND] = {
    'description': 'Not Found'
};
SWAGGER_DEFAULT_RESPONSE_MESSAGES[CONSTANTS.STATUS_CODE.ALREADY_EXISTS_CONFLICT] = {
    'description': 'Already Exists'
};
SWAGGER_DEFAULT_RESPONSE_MESSAGES[CONSTANTS.STATUS_CODE.SERVER_ERROR] = {
    'description': 'Internal Server Error'
};

const SUCCESS_OBJECT = Joi.object().keys({
    message: Joi.string(),
    statusCode: Joi.number(),
    data: Joi.any()
}).label('Success Response');
const ERROR_OBJECT = Joi.object().keys({
    message: Joi.string(),
    statusCode: Joi.number(),
    data: Joi.any()
}).label('Error Response');
class DefaultResponse {
    constructor(statusCode, response) {
        this[CONSTANTS.STATUS_CODE.OK] = {
            'description': 'OK',
            schema: SUCCESS_OBJECT
        };
        this[CONSTANTS.STATUS_CODE.CREATED] = {
            'description': 'Created'
        };
        this[CONSTANTS.STATUS_CODE.BAD_REQUEST] = {
            'description': 'Bad Request',
            schema: ERROR_OBJECT
        };
        this[CONSTANTS.STATUS_CODE.UNAUTHORIZED] = {
            'description': 'Unauthorized'
        };
        this[CONSTANTS.STATUS_CODE.NOT_FOUND] = {
            'description': 'Not Found'
        };
        this[CONSTANTS.STATUS_CODE.ALREADY_EXISTS_CONFLICT] = {
            'description': 'Already Exists'
        };
        this[CONSTANTS.STATUS_CODE.SERVER_ERROR] = {
            'description': 'Internal Server Error'
        };
        if (statusCode && response)
            this[statusCode].schema = response;
    }
}

module.exports = {
    SUCCESS_MESSAGES,
    SWAGGER_DEFAULT_RESPONSE_MESSAGES,
    ERROR_MESSAGES,
    DefaultResponse
};