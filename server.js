/**
 * Created by harekamsingh on 18/08/17.
 */
'use strict';
const Hapi = require('hapi'),
    config = require('./Config'),
    Plugins = require('./Plugins'),
    mongoose = require('mongoose'),
    bootstrap = require('./Utilities/bootstrap'),
    Routes = require('./Routes');
//mongoose.set('debug', true);

const server = new Hapi.Server();
const MONGO_DB_URI = config.dbConfig.mongodbURI;
let connectionOptions = {
    port: config.serverConfig.PORT,
    routes: {
        cors: true
    }
};

server.connection(connectionOptions);
/**
 * Plugins
 */
server.register(Plugins, function (err) {
    if (err) {
        server.error('Error while loading Plugins : ' + err)
    } else {
        server.log('info', 'Plugins Loaded')
        _init();
    }

});

function _init() {
    // API Routes
    Routes.forEach(function (api) {
        server.route(api);
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {

            return reply('Welcome to Manager online products!');
        }
    });
}
//Connect to MongoDB
mongoose.Promise = global.Promise; //mongoose warning fix
mongoose.connect(MONGO_DB_URI, (err) => {
    if (err) {
        server.log("DB Error: ", err);
        process.exit(1);
    } else {
        server.log('MongoDB Connected at', MONGO_DB_URI);
    }
});
// Start the server
server.start((err) => {
    if (err) {
        throw err;
    }
    server.log('Server running at:', server.info.uri);
});
bootstrap.bootstrapAdmin(function (err) {
    if (err)
        server.log('Bootstrap error', err);
});
const preResponse = function (request, reply) {

    const response = request.response;
    if (response.isBoom) {
        if (response.output.statusCode === 401) {
            //Reflect.deleteProperty(response.output.payload.validation);
            delete response.output.payload.error;
            delete response.output.payload.attributes;
            response.output.statusCode = 401;
            response.output.payload.message = `Access Denied`;
            response.output.payload.statusCode = 0;
            response.output.payload.data = {};
            return reply(response);
        }
    }
    return reply.continue();
};

server.ext('onPreResponse', preResponse);