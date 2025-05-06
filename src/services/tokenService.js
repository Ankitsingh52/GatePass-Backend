const { tokenRepository } = require('../repository/index');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/AppError');

class tokenService {
    constructor() {
        this.tokenRepositoryInst = new tokenRepository();
    }

    async saveToken(token, userId) {
        try {
            let savedToken = await this.tokenRepositoryInst.insertOne({ userId: userId, token: token});
            return savedToken;
        }
        catch(err) {
            console.log(err);
            if(err.statusCode === StatusCodes.NOT_FOUND){
                throw new AppError(`User Not Found`, StatusCodes.NOT_FOUND);
            }
            if(err.statusCode === StatusCodes.BAD_REQUEST){
                throw new AppError('Wrong Credentials', StatusCodes.BAD_REQUEST);
            }
            throw new AppError('Something went wrong while saving token', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getToken(token) {
        try {
            let fetchedToken = await this.tokenRepositoryInst.get({token: token});
            return fetchedToken;
        }
        catch(err) {
            console.log(err);
            if(err.statusCode === StatusCodes.NOT_FOUND){
                throw new AppError(`User Not Found`, StatusCodes.NOT_FOUND);
            }
            if(err.statusCode === StatusCodes.BAD_REQUEST){
                throw new AppError('Wrong Credentials', StatusCodes.BAD_REQUEST);
            }
            throw new AppError('Something went wrong while fetching token', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async invalidateToken(token, userId) {
        try {
            let invalidatedToken = await this.tokenRepositoryInst.update({ userId: userId,token: token}, {'$set': {isValid: false}});
            return invalidatedToken;
        }
        catch(err) {
            if(err.statusCode === StatusCodes.NOT_FOUND){
                throw new AppError(`User Not Found`, StatusCodes.NOT_FOUND);
            }
            if(err.statusCode === StatusCodes.BAD_REQUEST){
                throw new AppError('Wrong Credentials', StatusCodes.BAD_REQUEST);
            }
            throw new AppError('Something went wrong while fetching token', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = tokenService;