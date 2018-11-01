const Router = require('restify-router').Router;
const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authenticate = require('../auth');
const jwt = require('jsonwebtoken');
const config = require('../config');

const router = new Router();

router.post('/register', (req, res, next) => {
    if(!req.is('application/json')){
        return next(new errors.InvalidContentError("Expect 'application/json'"));
    }else{
        const { email, password } = req.body;

        const user = new User({
            email: email,
            password: password
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                user.save().then(() => {
                    res.send(201);
                    next();
                }).catch((err) => {
                    return next(new errors.InternalError(err.message));
                });
            });
        });
    }
});

router.post('/auth', (req, res, next) => {
    if(!req.is('application/json')){
        return next(new errors.InvalidContentError("Expect 'application/json'"));
    }else{
        const { email, password } = req.body;

        authenticate(email, password).then((data) => {
            const user = data;
            const token = jwt.sign(user.toJSON(), config.JWT_SECRET, { expiresIn: '15m' });
            const { iat, exp } = jwt.decode(token); //issued at , expires
            res.send({ iat, exp, token }); 
            next();
        }).catch((err) => {
            return next(new errors.UnauthorizedError(err));
        });
    }
});

module.exports = router;

