const config = require('../Config');
const constants = config.CONSTANTS;
const STATUS_CODE = constants.STATUS_CODE;
const DefaultResponse = config.RESPONSE_MESSAGES.DefaultResponse;
const Joi = require('joi');
const loginSuccessResponseObject = Joi.object().keys({
    message: Joi.string().required(),
    statusCode: Joi.number().required(),
    data: Joi.object().keys({
        accessToken: Joi.string().required()
    })
});
const loginSuccessResponse = new DefaultResponse(STATUS_CODE.OK, loginSuccessResponseObject);
const registerSuccessResponseObject = Joi.object().keys({
    message: Joi.string().required(),
    statusCode: Joi.number().required(),
    data: Joi.object().keys({
        password: Joi.string().required()
    })
});
const registerSuccessResponse = new DefaultResponse(STATUS_CODE.CREATED, registerSuccessResponseObject);
module.exports = {
    loginSuccessResponse,
    registerSuccessResponse
};