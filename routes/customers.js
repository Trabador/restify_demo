const Router = require('restify-router').Router;
const errors = require('restify-errors');
const Customer = require('../models/Customer');

const router = new Router();

//Get Customers
router.get('/customers', (req, res, next) => {
    Customer.find().then((customers) => {
        res.send(customers);
        next();
    }).catch((err) => { 
        return next(new errors.InvalidContentError(err)); 
    } );
    next();
});

//Get customer
router.get('/customers/:id', (req, res, next) => {
    Customer.findOne({ _id: req.params.id }).then((customer) => {
        if(customer){
            res.send(customer);
            next();
        }else{
            return next(new errors.ResourceNotFoundError(`No customer with id ${req.params.id}`));
        }
    }).catch((err) =>  {
        return next(new errors.ResourceNotFoundError(`No customer with id ${req.params.id}`));
    });
});

//Add customer
router.post('/customers', (req, res, next) => {
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
router.put('/customers/:id', (req, res, next) => {
    if(!req.is('application/json')){
        return next(new errors.InvalidContentError("Expect 'application/json'"));
    }else{
        const id = req.params.id;
        Customer.findOneAndUpdate({ _id: id }, req.body).then((updated) => {
            if(updated){
                res.send(200);
                next();
            }else{
                return next(new errors.ResourceNotFoundError(`No customer with id ${req.params.id}`));
            }
        }).catch((err) => {
            return next(new errors.ResourceNotFoundError(`No customer with id ${req.params.id}`));
        });
    }
});
//Delete customer
router.del('/customers/:id', (req, res, next) => {
    const id = req.params.id;
    Customer.findOneAndRemove({ _id: id}).then((deleted) => {
        if(deleted){
            res.send(204);
            next();
        }
        else{
            return next(new errors.ResourceNotFoundError(`No customer with id ${id}`));
        }
    }).catch((err) => {
        return next(new errors.ResourceNotFoundError(`No customer with id ${id}`));
    });
});

module.exports = router;