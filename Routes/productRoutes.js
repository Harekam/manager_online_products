/**
 * Created by harekamsingh on 18/08/17.
 */
'use strict';
const productController = require('../Controllers').productController;
const config = require('../Config');
const constants = config.CONSTANTS;
const util = require('../Utilities/util');
const Joi = require('joi');
const {
    REGEX,
    CONTENT_BOUNDS
} = constants;

const addProduct = {
    method: 'POST',
    path: '/api/v1/product',
    config: {
        auth: 'adminAuth',
        handler: (request, reply) => {
            const accessToken = request.auth && request.auth.credentials && request.auth.credentials.accessToken || null;
            const userData = request.auth && request.auth.artifacts || null;
            productController.addProduct({
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
                productName: Joi.string().required().trim().min(CONTENT_BOUNDS.name.min).max(CONTENT_BOUNDS.name.max),
                description: Joi.string().optional().trim().min(CONTENT_BOUNDS.description.min).max(CONTENT_BOUNDS.description.max),
                totalStock: Joi.number().required().integer(),
                totalSold: Joi.number().optional().integer(),
                price: Joi.number().required().positive(),
                discount: Joi.number().optional().min(0),
                salePrice: Joi.number().optional().positive(),
                brand: Joi.string().required().trim().min(CONTENT_BOUNDS.name.min).max(CONTENT_BOUNDS.name.max),
                isAvailable: Joi.boolean().default(true)
            },
            failAction: util.failActionFunction
        }
    }
};
const updateProduct = {
    method: 'PUT',
    path: '/api/v1/product(/:productId)',
    config: {
        auth: 'adminAuth',
        handler: (request, reply) => {
            const accessToken = request.auth && request.auth.credentials && request.auth.credentials.accessToken || null;
            const userData = request.auth && request.auth.artifacts || null;
            productController.updateProduct({
                userData,
                accessToken
            }, Object.assign({}, request.payload, request.params), (error, success) => {
                if (error)
                    return reply(error);
                return reply(null, success);
            });
        },
        validate: {
            headers: util.authorizeHeaderObject,
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
            },
            failAction: util.failActionFunction
        }

    }
};
const deleteProduct = {
    method: 'DELETE',
    path: '/api/v1/product(/:productId)',
    config: {
        auth: 'adminAuth',
        handler: (request, reply) => {
            const accessToken = request.auth && request.auth.credentials && request.auth.credentials.accessToken || null;
            const userData = request.auth && request.auth.artifacts || null;
            productController.deleteProduct({
                userData,
                accessToken
            }, request.params, (error, success) => {
                if (error)
                    return reply(error);
                return reply(null, success);
            });
        },
        validate: {
            headers: util.authorizeHeaderObject,
            params: {
                productId: Joi.string().required().trim().regex(REGEX.OBJECT_ID)
            },
            failAction: util.failActionFunction
        }
    }
};
const getProduct = {
    method: 'GET',
    path: '/api/v1/product',
    config: {
        auth: 'adminAuth',
        handler: (request, reply) => {
            const accessToken = request.auth && request.auth.credentials && request.auth.credentials.accessToken || null;
            const userData = request.auth && request.auth.artifacts || null;
            productController.getProduct({
                userData,
                accessToken
            }, request.query, (error, success) => {
                if (error)
                    return reply(error);
                return reply(null, success);
            });
        },
        validate: {
            headers: util.authorizeHeaderObject,
            query: {
                productId: Joi.string().optional().trim().regex(REGEX.OBJECT_ID),
                searchText: Joi.string().optional().trim().lowercase().description("search by product name").min(CONTENT_BOUNDS.searchText.min).max(CONTENT_BOUNDS.searchText.max),
                orderBy: Joi.string().optional().valid(
                    constants.SORT_ORDER.ASC,
                    constants.SORT_ORDER.DESC
                ).default(constants.SORT_ORDER.DESC),
                includeDeleted: Joi.boolean().optional().default(false),
                limit: Joi.number().optional().min(1).default(constants.DEFAULT_LIMIT).max(constants.DEFAULT_LIMIT),
                skip: Joi.number().optional().min(0).default(0)
            },
            failAction: util.failActionFunction
        }
    }
};

module.exports = [
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct
];