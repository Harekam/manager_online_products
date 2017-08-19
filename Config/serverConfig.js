/**
 * Created by harekam on 27/08/15.
 */
'use strict';

const JWT_SECRET_KEY = 'Aw0UwvMGLuQx2sIhXohYMvyWAJOJC7OqoXbI5BiqJxwBuifJYjJl4xGIzBckezqnvBEAeiYdKTOrgV3YgoseuaT2o4K5pnRfK5N2s7In0JdBniObqFP7JqNuLIlhIrfJ';
const APP_NAME = 'Manager Online Products';
module.exports = {
    JWT_SECRET_KEY,
    APP_NAME,
    PORT: process.env.PORT || 8000
};