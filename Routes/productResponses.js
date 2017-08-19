const config = require('../Config');
const constants = config.CONSTANTS;
const STATUS_CODE = constants.STATUS_CODE;
const DefaultResponse = config.RESPONSE_MESSAGES.DefaultResponse;
const Joi = require('joi');
const createProductSuccessResponseObject = Joi.object().keys({
    message: Joi.string().required(),
    statusCode: Joi.number().required(),
    data: Joi.object().keys({
        _id: Joi.string().required()
    })
});
const createProductSuccessResponse = new DefaultResponse(STATUS_CODE.CREATED, createProductSuccessResponseObject);
const getProductSuccessResponseObject = Joi.object().keys({
    message: Joi.string().required(),
    statusCode: Joi.number().required(),
    data: Joi.object().keys({
        totalCount: Joi.string().optional(),
        products: Joi.array().optional().items(Joi.object().keys({
            _id: Joi.string().required(),
            updatedAt: Joi.date().required(),
            createdAt: Joi.date().required(),
            productName: Joi.string().required(),
            description: Joi.string().required(),
            totalStock: Joi.number().required(),
            price: Joi.number().required(),
            discount: Joi.number().required(),
            salePrice: Joi.number().required(),
            brand: Joi.string().required(),
            isDeleted: Joi.boolean().required(),
            isAvailable: Joi.boolean().required(),
            totalUsersRated: Joi.number().required(),
            totalRating: Joi.number().required(),
            totalSold: Joi.number().required()
        }))
    })
});
const getProductSuccessResponse = new DefaultResponse(STATUS_CODE.OK, getProductSuccessResponseObject);

module.exports = {
    createProductSuccessResponse,
    getProductSuccessResponse
};