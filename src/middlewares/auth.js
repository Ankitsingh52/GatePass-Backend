const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { JWT_SECRET } = require('../config/serverConfig');
const { errorResponse } = require('../utils/common');
const AppError = require('../utils/errors/AppError');
const { redisClient }  = require('../redisClient');
const { promisify } = require('util');
const { redisGetAsync } = require('../redisClient');
const { userService, tokenService } = require('../services/index');
const { decode } = require('punycode');


const authenticateJWT = async (req, res, next) => {
    try {
        console.log('req headers::', req.headers);
        const token = req.headers['authorization']?.replace('Bearer', '').trim();
        if (!token) {
            errorResponse.message = 'Missing Token, Authorization Denied';
            errorResponse.error = new AppError(['Missing Token, Authorization Denied'], StatusCodes.UNAUTHORIZED);
            
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(errorResponse);
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded) {
            errorResponse.message = 'Invalid Access Token';
            errorResponse.error = new AppError(['Invalid Access Token'], StatusCodes.BAD_REQUEST);
            
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse);
        }
        
        // let redisPrefix = 'userDetails' + decoded.user.id;
        const tokenStatusInCache = await redisGetAsync(token);
        console.log(token);
        console.log('tokenStatusInCache::', tokenStatusInCache);
        if(tokenStatusInCache === 'blacklisted') {
            errorResponse.message = 'Invalid Access Token';
            errorResponse.err = new AppError(['Invalid Access Token']. StatusCodes.BAD_REQUEST);
            return res 
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse);
        }
        if(!tokenStatusInCache) {
            const tokenServiceInst = new tokenService();
            const tokenStatusInDB = await tokenServiceInst.getToken(token);
            console.log(tokenStatusInDB);
            if(!tokenStatusInDB || !tokenStatusInDB.isValid) {
                errorResponse.message = 'Invalid Access Token';
                errorResponse.err = new AppError(['Invalid Access Token']. StatusCodes.BAD_REQUEST);
                return res 
                    .status(StatusCodes.BAD_REQUEST)
                    .json(errorResponse);
            }
        }
        // const redisPrefix = "userDetails:" + decoded.user?.id;
        // let userDatainCache = await redisGetAsync(redisPrefix);
        // userDatainCache = JSON.parse(userDatainCache);
        // if(userDatainCache) {
        //     if(userDatainCache.tokenVersion != decoded.user?.version) {
        //         errorResponse.message = 'Invalid Access Token';
        //         errorResponse.error = new AppError(['Invalid Access Token'], StatusCodes.BAD_REQUEST);
        //         return res
        //             .status(StatusCodes.BAD_REQUEST)
        //             .json(errorResponse);
        //     }
        // }
        // if(!userDatainCache) {
        //     let userServiceInst = new userService();
        //     let userDatainDB = await userServiceInst.fetchUser(decoded.user.id);
        //     if(userDatainDB.tokenVersion != decoded.user?.version) {
        //         errorResponse.message = 'Invalid Access Token';
        //         errorResponse.error = new AppError(['Invalid Access Token'], StatusCodes.BAD_REQUEST);
        //         return res
        //             .status(StatusCodes.BAD_REQUEST)
        //             .json(errorResponse);
        //     }
        // }
        let userServiceInst = new userService();
        let userData = await userServiceInst.fetchUser(decoded.user.id);
        if(userData) {
            if(userData?.tokenVersion != decoded.user?.version) {
                errorResponse.message = 'Invalid Access Token';
                errorResponse.error = new AppError(['Invalid Access Token'], StatusCodes.BAD_REQUEST);
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json(errorResponse);
            }
        }
        console.log('middleware userData::', userData);
        // req.userContext = decoded.user;
        req.userContext = userData;
        next();
    }
    catch (err) {
        console.log(err);
        errorResponse.message = 'Invalid Access Token';
        errorResponse.error = new AppError(['Invalid Access Token'], StatusCodes.BAD_REQUEST);

        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(errorResponse);
    }
};

const verifyRole = (expectedRole) => {
    return (req, res, next) => {
        if (req.userContext.role !== expectedRole) {
            errorResponse.message = 'Unauthorized Access';
            errorResponse.error = new AppError(['Your access is denied'], StatusCodes.FORBIDDEN);

            return res.status(StatusCodes.FORBIDDEN).json(errorResponse);
        }
        next();
    };
};


const verifyApprover = (req, res, next) => {
    console.log('verify approver', req?.userContext.role);
    if(req.userContext.role != 'hod' && req.userContext.role != 'vice-hod' && req.userContext.role != 'coordinator') {
        errorResponse.message = 'UnAuthorized Access';
        errorResponse.error = new AppError(['Your Access is Denied'], StatusCodes.BAD_REQUEST);

        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(errorResponse);
    }
    next();
}

// const sendInvalidReqResponse = function(message, req, res) {
//     errorResponse.message = 'Missing Token, Authorization Denied';
//     errorResponse.error = new AppError(['Missing Token, Authorization Denied'], StatusCodes.UNAUTHORIZED);         
//     return res
//             .status(StatusCodes.UNAUTHORIZED)
//             .json(errorResponse);
// }

const sendErrorResponse = function (message, req, res) {
    errorResponse.message = 'Missing Token, Authorization Denied';
    errorResponse.error = new AppError(['Missing Token, Authorization Denied'], StatusCodes.UNAUTHORIZED);         
    return res
            .status(StatusCodes.UNAUTHORIZED)
            .json(errorResponse);
}

module.exports = {
    authenticateJWT,
    verifyRole,
    verifyApprover
};