/**
 * Created by harekam on 27/08/15.
 */
'use strict';

const JWT_SECRET_KEY = 'Aw0UwvMGLuQx2sIhXohYMvyWAJOJC7OqoXbI5BiqJxwBuifJYjJl4xGIzBckezqnvBEAeiYdKTOrgV3YgoseuaT2o4K5pnRfK5N2s7In0JdBniObqFP7JqNuLIlhIrfJ';
const APP_NAME = 'Manager Online Products';
const UrlPattern = require('url-pattern');

const API_PATH = {
    CREATE_PRODUCT: {
        path: "/api/v1/product",
        method: "POST"
    },
    UPDATE_PRODUCT: {
        path: "/api/v1/product(/:productId)",
        method: "PUT",
        pattern: function () {
            return new UrlPattern(this.path);
        }
    },
    DELETE_PRODUCT: {
        path: "/api/v1/product(/:productId)",
        method: "DELETE",
        pattern: function () {
            return new UrlPattern(this.path);
        }
    },
    GET_PRODUCT: {
        path: "/api/v1/product",
        method: "GET"
    },
    CREATE_ADMIN: {
        path: "/api/v1/admin",
        method: "POST"
    },
    LOGIN_ADMIN: {
        path: "/api/v1/admin/login",
        method: "POST"
    }
};
module.exports = {
    API_PATH,
    JWT_SECRET_KEY,
    APP_NAME,
    PORT: process.env.PORT || 8000
};