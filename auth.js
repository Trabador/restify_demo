const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

module.exports = function authenticate(email, password){
    return new Promise((resolve, reject) =>  {
        User.findOne({email}).then((user) => {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err){
                    throw err;
                }else{
                    if(isMatch){
                        resolve(user);
                    }else{
                        reject('Authentication Failed');
                    }   
                }
            });
        }).catch((err) => {
            reject('Authentication Failed')
        });
    });
};