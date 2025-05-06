const userModel = require('../models/user');
const crudRepository = require('./crudRepository');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ObjectId = mongoose.Types.ObjectId;

class userRepository extends crudRepository{
    constructor() {
        super(userModel);
    }

    async findUserById(userId) {
        try {
            const user = await this.model.findOne({_id: new ObjectId(userId)});
            if(!user) {
                return {};
            }
            return user;
        }
        catch(err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    async removeUser(userId) {
        try {
            const user = await this.model.deleteOne({_id: new ObjectId(userId)});
            return user;
        }
        catch(err) {
            console.log(err);
            return Promise.reject(err);
        }
    }
    async updateUser(userId, userDetails) {
        try {
            if(userDetails.password) {
                const bcryptRegex = /^\$2[ayb]\$.{56}$/;
                if (!bcryptRegex.test(userDetails.password)) {
                    console.log('Password is in plain text, hashing it now...');
                    userDetails.password = await bcrypt.hash(userDetails.password, 10);
                    console.log('Password successfully hashed');
                } else {
                    console.log('Password is already bcrypt hashed');
                }
            }
            if(userDetails._id) {
                delete userDetails._id;
            }
            const user = await this.model.updateOne({_id: new ObjectId(userId)}, userDetails);
            return user;
        }
        catch(err) {
            console.log(err);
            return Promise.reject(err);
        }
    }
};

module.exports = userRepository;