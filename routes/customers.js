const errors = require('restify-errors');
const Customer = require('../models/Customer');

module.exports = (server) => {
    //Get Customers
    server.get('/customers', (req, res, next) => {
        Customer.find().then((customers) => {
            console.log(customers);
            res.send(customers);
            next();
        }).catch((err) => { 
            console.log(err);
            return next(new errors.InvalidContentError(err)); 
        } );
        next();
    });

    //Get customer
    server.get('/customers/:id', (req, res, next) => {
        Customer.findById(req.params.id).then((customer) => {
            res.send(customer);
            next()
        }).catch((err) =>  {
            return next(new errors.ResourceNotFoundError(`No customer with id ${req.params.id}`));
        });
    });

    //Add customer
    server.post('/customers', (req, res, next) => {
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expect 'application/json'"));
        }else{
            const { name, email, balance } = req.body;

            const customer = new Customer({
                name: name,
                email: email,
                balance: balance
            });

            customer.save().then(() => {
                res.send(201);
                next();
            }).catch((err) => {
                return next(new errors.InternalError(err.message));
            });
        }
    });

    //Update customer
    server.put('/customers/:id', (req, res, next) => {
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expect 'application/json'"));
        }else{
            const id = req.params.id;
            Customer.findByIdAndUpdate(id, req.body).then(() => {
                res.send(200);
                next();
            }).catch((errr) => {
                return next(new errors.ResourceNotFoundError(`No customer with id ${req.params.id}`));
            });
        }
    });

    //Delete customer
    server.del('/customers/:id', (req, res, next) => {
        const id = req.params.id;
        Customer.findByIdAndDelete(id).then(() => {
            res.send(204);
            next();
        }).catch((err) => {
            return next(new errors.ResourceNotFoundError(`No customer with id ${id}`));
        });
    });
}