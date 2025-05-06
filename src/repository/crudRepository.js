const AppError = require('../utils/errors/AppError');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
class crudRepository {
    constructor(model) {
        this.model = model;
    }

    async get(query, proj = {}){
        console.trace();
        console.log('get this.model::', this.model);
        const response = await this.model.findOne(query, proj);
        if(!response){
            throw new AppError(['Not able to find the resource'], StatusCodes.NOT_FOUND);
        }
        console.log('resp::', response);

        return response;
    }

    async update(query, data) {
        const response = await this.model.updateOne(query, data);
        if(!response){
            throw new AppError(['Not able to find the resource'], StatusCodes.NOT_FOUND);
        }

        return response;
    }

    async getAll(query, proj) {
        try {
            const response = await this.model.find(query, proj);
            if(!response){
                throw new AppError(['Not able to find the resource'], StatusCodes.NOT_FOUND);
            }
            console.log('resp getAll::', response);
            return response;
        }
        catch(err) {
            console.log(err);
            return err;
        }
    }

    async insertOne(data) {
        try {
            console.log("Model type:", this.model);
            console.log("Is Mongoose model:", this.model instanceof mongoose.Model);

            console.log('data::', data);
            const response = await this.model.create(data);
            if(!response){
                throw new AppError(['Not able to find the resource'], StatusCodes.NOT_FOUND);
            }

            return response;
        }
        catch(err) {
            // return err;
            console.log("This error::", err);
            return Promise.reject(new AppError('Something went wrong while applying for gatePass', StatusCodes.INTERNAL_SERVER_ERROR));
            // return new AppError('Something went wrong while changing the user password', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async insertMany(data) {
        try {
            console.log('this.model::', this.model);
            const response = await this.model.insertMany(data);
            if(!response){
                throw new AppError(['Not able to find the resource'], StatusCodes.NOT_FOUND);
            }

            return response;
        }
        catch(err) {
            console.log(err);
            // throw new err;
        }
    }
}

module.exports = crudRepository;