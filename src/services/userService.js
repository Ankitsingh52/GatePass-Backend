const { userRepository } = require('../repository/index');
const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/AppError');
const { redisGetAsync } = require('../redisClient');

class userService {
    constructor() {
        this.userRepository = new userRepository();
    }
    async findUser(username, password) {
        try {
            const userDetails = await this.userRepository.get({username: username});
            console.log('UserDetails::', userDetails);
            if (!userDetails) {
                return {
                    userNotExists: true
                };
            }
            const isMatch = await bcrypt.compare(password, userDetails.password);
            if (!isMatch) {
                return {
                    invalidCredentials: true
                };
                // throw new AppError('Wrong credentials Provided', StatusCodes.BAD_REQUEST);
            }

            return userDetails;
        }
        catch(err) {
            console.log(err);
            if(err.statusCode === StatusCodes.NOT_FOUND){
                return Promise.reject(new AppError(`User Not Found`, StatusCodes.NOT_FOUND));
            }
            if(err.statusCode === StatusCodes.BAD_REQUEST){
                return Promise.reject(new AppError('Wrong Credentials', StatusCodes.BAD_REQUEST));
            }
            return Promise.reject(new AppError('Something went wrong while changing the user password', StatusCodes.INTERNAL_SERVER_ERROR));
        }
    }
    async changePassword(username, password, newPassword) {
        try {
            // const changePwdResp = await this.userRepository.changePassword(username, password, newPassword);
            // return changePwdResp;
            const user = await this.userRepository.get({username: username});
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                throw new AppError('Wrong credentials Provided', StatusCodes.BAD_REQUEST);
            }
            newPassword = await bcrypt.hash(newPassword, 10);
            const changePwdResp = await this.userRepository.update({username: username},
                {password: newPassword}
            );
            return changePwdResp;
        }
        catch(err) {
            if(err.statusCode === StatusCodes.NOT_FOUND){
                throw new AppError('User Not Found', StatusCodes.NOT_FOUND);
            }
            if(err.statusCode === StatusCodes.NOT_FOUND){
                throw new AppError('User Not Found', StatusCodes.NOT_FOUND);
            }
            throw new AppError('Something went wrong while changing the user password', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    async updateTokenVersion(userId) {
        try {
            let updateObj = {
                '$inc': { tokenVersion: 1}
            };
            const updatedUser = await this.userRepository.update({ _id: userId }, updateObj);
            return updatedUser;
        }
        catch(err) {
            console.log(err);
            if(err.statusCode === StatusCodes.NOT_FOUND){
                return Promise.reject(new AppError(`User Not Found`, StatusCodes.NOT_FOUND));
            }
            if(err.statusCode === StatusCodes.BAD_REQUEST){
                return Promise.reject(new AppError('Wrong Credentials', StatusCodes.BAD_REQUEST));
            }
            return Promise.reject(new AppError('Something went wrong while changing updating token version', StatusCodes.INTERNAL_SERVER_ERROR));
        }

    }
    async fetchUser(userId) {
        try {
            // const userDetails = await this.userRepository.get({_id: userId});
            // return userDetails;

            const redisPrefix = "userDetails:" + userId;
            let userDatainCache = await redisGetAsync(redisPrefix);
            if(userDatainCache) {
                return JSON.parse(userDatainCache);
            }
            else {
                const userDetails = await this.userRepository.get({_id: userId});
                return userDetails;
            }
        }
        catch(err) {
            console.log(err);
            if(err.statusCode === StatusCodes.NOT_FOUND){
                return Promise.reject(new AppError(`User Not Found`, StatusCodes.NOT_FOUND));
            }
            if(err.statusCode === StatusCodes.BAD_REQUEST){
                return Promise.reject(new AppError('Wrong Credentials', StatusCodes.BAD_REQUEST));
            }
            return Promise.reject(new AppError('Something went wrong while changing the user password', StatusCodes.INTERNAL_SERVER_ERROR));
        }

    }
    async fetchApprovers(dept) {
        try {
            let approvers = await this.userRepository.getAll({
                '$and': [
                    { department: dept },
                    {
                        '$or': [
                            { role: 'hod' },
                            { role: 'vice-hod' },
                            { role: 'coordinator' }
                        ]
                    }
                    ]
                },
            );
            approvers = approvers.map(currApprover => currApprover._id);
            return approvers;
        }
        catch(err) {
            console.log(err);
            return Promise.reject(err);
        }
    }
}

module.exports = userService;