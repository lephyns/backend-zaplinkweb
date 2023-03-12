'use strict';

const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');

const mongoUrl = "mongodb+srv://qaninja:qaninja@zaplinkcluster.fapnnxf.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
    if (process.env.NODE_ENV === 'test') {
        mongoose.connection.db.dropDatabase();
        console.log('MongoDB test database dropped');
    }
});

mongoose.connection.on('error', (error) => {
    console.log('MongoDB error ' + error)
})

const contactRoutes = require('./routes/contact.routes')
const userRoutes = require('./routes/user.routes')

const server = Hapi.server({
    port: 3000,
    // host: 'localhost', //Apenas para acesso local
    host: '0.0.0.0', //Libera para acesso externo
    routes: {
        cors: {
            // origin: ['http://localhost:8080'] // Libera apenas para esta rota
            origin: ['*'] // Libera a porta 3000 para qualquer aplicação
        }
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {

        return { message: "Welcome to ZapLink API", company: "QA Ninja", course: "DevTester" };
    }
});

server.route(contactRoutes)
server.route(userRoutes) //Adicionado a rota no servidor

server.start((err, h) => {

    if(err) {
        throw err;
    }
    console.log('Server running on %s', server.info.uri);
});

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

exports.init = async () => {
    return server;
}