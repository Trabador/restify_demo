const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const customersRouter = require('./routes/customers');

const server = restify.createServer();

//Midleware
server.use(restify.plugins.bodyParser());

server.listen(config.PORT, () => {
    mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true});
    console.log(`Conected to DB`);
});

const db = mongoose.connection;

db.on('error', (err) => { console.log(err) });
db.once('open', () => {
    customersRouter.applyRoutes(server);
    console.log(`Server Started on port ${config.PORT}`);
});