/**
 * Created by harekamsingh on 18/08/17.
 */
'use strict';
const productController = require('../Controllers').productController;
const config = require('../Config');
const constants = config.CONSTANTS;
const util = require('../Utilities/util');
const Joi = require('joi');
const DefaultResponse = config.RESPONSE_MESSAGES.DefaultResponse;
const REGEX = constants.REGEX;
const tags = ['api', 'admin', 'product'];
const productResponses = require('./productResponses');
const notes = 'auth token should be in pattern(without quotes): "bearer access_token"';

const addProduct = {
    method: 'POST',
    path: '/api/v1/product',
    config: {
        auth: 'adminAuth',
        notes,
        description: 'add product',
        tags,
        handler: (request, reply) => {
            const accessToken = request.auth && request.auth.credentials && request.auth.credentials.accessToken || null;
            const userData = request.auth && request.auth.artifacts || null;
            productController.addProduct({
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
                productName: Joi.string().required().trim(),
                description: Joi.string().optional().trim(),
                totalStock: Joi.number().required().integer(),
                totalSold: Joi.number().optional().integer(),
                price: Joi.number().required().positive(),
                discount: Joi.number().optional().min(0),
                salePrice: Joi.number().optional().positive(),
                brand: Joi.string().required().trim(),
                isAvailable: Joi.boolean().default(true)
            },
            failAction: util.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responses: productResponses.createProductSuccessResponse
            }
        }

    }
};
const updateProduct = {
    method: 'PUT',
    path: '/api/v1/product/{productId}',
    config: {
        auth: 'adminAuth',
        notes,
        description: 'update product',
        tags,
        handler: (request, reply) => {
            const accessToken = request.auth && request.auth.credentials && request.auth.credentials.accessToken || null;
            const userData = request.auth && request.auth.artifacts || null;
            productController.updateProduct({
                userData,
                accessToken
            }, Object.assign({}, request.payload, request.params), (error, success) => {

                if (error)
                    return reply(error.response).code(error.statusCode);

                return reply(success.response).code(success.statusCode);

            });
        },
        validate: {
            headers: util.authorizeHeaderObject,
            params: {
                productId: Joi.string().required().trim().regex(REGEX.OBJECT_ID)
            },
            payload: {
                productName: Joi.string().optional().trim(),
                description: Joi.string().optional().trim(),
                totalStock: Joi.number().optional().integer(),
                totalSold: Joi.number().optional().integer(),
                price: Joi.number().optional().positive(),
                discount: Joi.number().optional().min(0),
                salePrice: Joi.number().optional().positive(),
                brand: Joi.string().optional().trim(),
                isAvailable: Joi.boolean().optional()
            },
            failAction: util.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responses: new DefaultResponse()
            }
        }

    }
};
const deleteProduct = {
    method: 'DELETE',
    path: '/api/v1/product/{productId}',
    config: {
        auth: 'adminAuth',
        notes,
        description: 'delete product',
        tags,
        handler: (request, reply) => {
            const accessToken = request.auth && request.auth.credentials && request.auth.credentials.accessToken || null;
            const userData = request.auth && request.auth.artifacts || null;
            productController.deleteProduct({
                userData,
                accessToken
            }, request.params, (error, success) => {

                if (error)
                    return reply(error.response).code(error.statusCode);

                return reply(success.response).code(success.statusCode);

            });
        },
        validate: {
            headers: util.authorizeHeaderObject,
            params: {
                productId: Joi.string().required().trim().regex(REGEX.OBJECT_ID)
            },
            failAction: util.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responses: new DefaultResponse()
            }
        }

    }
};
const getProduct = {
    method: 'GET',
    path: '/api/v1/product',
    config: {
        auth: 'adminAuth',
        notes,
        description: 'get product',
        tags,
        handler: (request, reply) => {
            const accessToken = request.auth && request.auth.credentials && request.auth.credentials.accessToken || null;
            const userData = request.auth && request.auth.artifacts || null;
            productController.getProduct({
                userData,
                accessToken
            }, request.query, (error, success) => {

                if (error)
                    return reply(error.response).code(error.statusCode);

                return reply(success.response).code(success.statusCode);

            });
        },
        validate: {
            headers: util.authorizeHeaderObject,
            query: {
                productId: Joi.string().optional().trim().regex(REGEX.OBJECT_ID),
                searchText: Joi.string().optional().trim().lowercase().description("search by product name"),
                orderBy: Joi.string().optional().valid(
                    constants.SORT_ORDER.ASC,
                    constants.SORT_ORDER.DESC
                ).default(constants.SORT_ORDER.DESC),
                includeDeleted: Joi.boolean().optional().default(false),
                limit: Joi.number().optional().min(1).default(constants.DEFAULT_LIMIT).max(constants.DEFAULT_LIMIT),
                skip: Joi.number().optional().min(0).default(0)
            },
            failAction: util.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responses: productResponses.getProductSuccessResponse
            }
        }

    }
};

module.exports = [
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct
];