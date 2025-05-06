let { userService, tokenService } = require('../services/index');
let { StatusCodes } = require('http-status-codes');
let { successResponse, errorResponse } = require('../utils/common');
let AppError = require('../utils/errors/AppError');
let jwt = require('jsonwebtoken');
let { JWT_SECRET, REDIS_EXPIRY } = require('../config/serverConfig');
let configs = require('../config/configs.json');
const jwtExpiry = require('../config/serverConfig').JWT_EXPIRY;
let Promise = require('bluebird');
let { redisClient, redisGetAsync } = require('../redisClient');
let { Promisify } = require('util');

let handleLogin = async (req, res) => {
    try {
        if(!JWT_SECRET) {
            JWT_SECRET = configs.JWT_SECRET;
        }
        let userServiceInst = new userService();
        let { username, password } = req.body;
        if (!username || !password) {
            errorResponse.message = 'Please provide complete credentials';
            errorResponse.error = new AppError(['User Credentials Missing'], StatusCodes.BAD_REQUEST);
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse);
        }
        let userCredentials = await userServiceInst.findUser(username, password);
        userCredentials.tokenVersion += 1;
        await userServiceInst.updateTokenVersion(userCredentials._id);
        if (userCredentials?.userNotExists) {
            errorResponse.message = 'User Not Found';
            errorResponse.error = new AppError(['User Does Not Exists'], StatusCodes.NOT_FOUND);
            return res
                .status(StatusCodes.NOT_FOUND)
                .json(errorResponse);
        }
        else if (userCredentials?.invalidCredentials) {
            errorResponse.message = 'Invalid Credentials';
            errorResponse.error = new AppError(['Provided Login Credentials are Invalid'], StatusCodes.UNAUTHORIZED);
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(errorResponse);
        }
        let payload = {
            user: {
                id: userCredentials?._id,
                username: userCredentials?.username,
                name: userCredentials?.name,
                role: userCredentials?.role,
                version: userCredentials?.tokenVersion
            }
        };
        jwt.sign(payload, JWT_SECRET, { expiresIn: jwtExpiry}, async (err, token) => {
            if (err) {
                // throw new Error(err);
                console.log(err);
            }
            userCredentials.password = undefined;
            let userCreds = {
                token: token,
                user: userCredentials
            };
            console.log('jwt-g::', JWT_SECRET);
            successResponse.message = 'Successfully Logged In';
            successResponse.data = userCreds;
            let redisPrefix = "userDetails:" + userCredentials?._id;
            await redisClient.set(redisPrefix, JSON.stringify(userCredentials), 'EX', REDIS_EXPIRY, (err, reply) => {
                if(err) {
                    errorResponse.message = 'Something went wrong while Logging In';
                    errorResponse.error = new AppError(['Something went wrong while Logging In'], StatusCodes.NOT_FOUND);
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .json(errorResponse); 
                }
                else {
                    console.log('UCRd::', userCredentials);
                    console.log('Data is stored in redis with prefix:', redisPrefix);
                }
            }); 
            let tokenServiceInst = new tokenService();
            await tokenServiceInst.saveToken(token, userCredentials?._id);
            return res
                .status(StatusCodes.OK)
                .json(successResponse);
        });
    }
    catch (err) {
        console.log(err);
        if (err.statusCode === StatusCodes.NOT_FOUND) {
            errorResponse.message = 'User Not Found';
            errorResponse.error = new AppError(['User Not Found'], StatusCodes.NOT_FOUND);
            return res
                .status(StatusCodes.NOT_FOUND)
                .json(errorResponse);
        }
        if (err.statusCode === StatusCodes.BAD_REQUEST) {
            errorResponse.message = 'Wrong Credentials';
            errorResponse.error = new AppError(['Wrong Credentials'], StatusCodes.BAD_REQUEST);
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse);
        }
        errorResponse.message = 'Something went wrong in the user Authentication';
        errorResponse.error = new AppError(['Something went wrong while fetching user credentials'], StatusCodes.INTERNAL_SERVER_ERROR);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse);
    }
};

let handleLogout = async (req, res) => {
    try {
        
        let token = req.headers['authorization'].replace('Bearer', '').trim();
        if(!token) {
            errorResponse.message = 'Access token not found';
            errorResponse.err = new AppError(['Access token not found'], StatusCodes.BAD_REQUEST);
            return res 
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse);
        }
        let decodedVerified = jwt.decode(token);
        // if(!decodedVerified) {
        //     errorResponse.message = 'Invalid Access token';
        //     errorResponse.err = new AppError(['Invalid Access token'], StatusCodes.BAD_REQUEST);
        //     return res 
        //         .status(StatusCodes.BAD_REQUEST)
        //         .json(errorResponse);
        // }
        let currentTime = Math.floor(Date.now() / 1000);
        let remainingTime = decodedVerified.exp - currentTime;
        if(remainingTime > 0) {
            await redisClient.setex(token, remainingTime, 'blacklisted', (err, reply) => {
                if(err) {
                    errorResponse.message = 'Something went wrong while invalidating the token';
                    errorResponse.err = new AppError(['Something went wrong while invalidating the token'], StatusCodes.BAD_REQUEST);
                    return res 
                        .status(StatusCodes.BAD_REQUEST)
                        .json(errorResponse);
                }
                // else {
                //     console.log(`Token blacklisted with TTL of ${remainingTime} seconds`);
                //     successResponse.message = 'You have Successfully Logged Out';
                //     successResponse.data = {};
                //     return res
                //         .status(StatusCodes.ACCEPTED)
                //         .json(successResponse)
                // }
            });
        }
        else {
            errorResponse.message = 'Access token is expired';
            errorResponse.err = new AppError(['Access token is expired'], StatusCodes.BAD_REQUEST);
            return res 
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse);
        }
        let tokenServiceInst = new tokenService();
        await tokenServiceInst.invalidateToken(token, decodedVerified.user.id);
        successResponse.message = 'You have Successfully Logged Out';
        successResponse.data = {};
        return res
            .status(StatusCodes.ACCEPTED)
            .json(successResponse);
    }
    catch(err) {
        errorResponse.message = 'Something went wrong while logging out';
        errorResponse.err = new AppError(['Something went wrong while logging out'], StatusCodes.INTERNAL_SERVER_ERROR);
        return res 
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse);
    }
}

let changePassword = async (req, res) => {
    try {
        let userServiceInst = new userService();
        let { username, password, newPassword } = req.body;
        if (!username || !password || !newPassword) {
            errorResponse.message = 'Please provide complete credentials, i.e username, current password and new password';
            errorResponse.error = new AppError(['User Credentials Missing'], StatusCodes.BAD_REQUEST);
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse);
        }
        let changePwdResp = await userServiceInst.changePassword(username, password, newPassword);
        if (changePwdResp) {
            successResponse.message = 'Successfully changed the password';
            successResponse.data = changePwdResp;
            return res
                .status(StatusCodes.ACCEPTED)
                .json(successResponse)
        }
    }
    catch (err) {
        if (err.statusCode === StatusCodes.BAD_REQUEST) {
            errorResponse.message = 'Wrong Credentials';
            errorResponse.error = new AppError(['Wrong Credentials'], StatusCodes.BAD_REQUEST);
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse);
        }
        if (err.statusCode === StatusCodes.NOT_FOUND) {
            errorResponse.message = 'User Not Found';
            errorResponse.error = new AppError(['User Not Found'], StatusCodes.NOT_FOUND);
            return res
                .status(StatusCodes.NOT_FOUND)
                .json(errorResponse);
        }
        console.log(err);
        errorResponse.message = 'Something went wrong while changing the user password';
        errorResponse.error = new AppError(['Something went wrong while changing the user password'], StatusCodes.INTERNAL_SERVER_ERROR);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse);
    }
};

module.exports = {
    handleLogin,
    changePassword,
    handleLogout
};