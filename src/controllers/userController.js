const userService = require('../services/userService');
const { StatusCodes, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const {successResponse, errorResponse } = require('../utils/common');
const AppError = require('../utils/errors/AppError');

const createUser = async (req, res) => {
    try {
        let userServiceInst = new userService();
        let userDetails = req.body;
        if (!userDetails || !userDetails?.name || !userDetails?.username || !userDetails?.password || !userDetails?.email || !userDetails?.role || !userDetails?.rollNo || !userDetails?.college || !userDetails?.course || !userDetails?.year || !userDetails?.department) {
            errorResponse.message = 'Please provide user details';
            errorResponse.error = new AppError(['User Details Missing'], StatusCodes.BAD_REQUEST);
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse);
        }
        let createdUser = await userServiceInst.addUser(userDetails);
        successResponse.message = 'Successfully created the user';
        successResponse.data = createdUser;
        return res
            .status(StatusCodes.CREATED)
            .json(successResponse);
    }
    catch(err) {
        console.log(err);
        errorResponse.message = 'Something went wrong while creating the user';
        errorResponse.error = new AppError(['Something went wrong while creating the user'], StatusCodes.INTERNAL_SERVER_ERROR);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse);
    }
}

const updateUser = async (req, res) => {
    try {
        let userServiceInst = new userService();
        let userId = req.params.userId;
        let userDetails = req.body;
        if (!userDetails) {
            errorResponse.message = 'Please provide user details to update';
            errorResponse.error = new AppError(['User Details Missing for updation'], StatusCodes.BAD_REQUEST);
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse);
        }
        let updatedUser = await userServiceInst.updateUser(userId, userDetails);
        successResponse.message = 'Successfully updated the user';
        successResponse.data = updatedUser;
        return res
            .status(StatusCodes.OK)
            .json(successResponse);
    }
    catch(err) {
        console.log(err);
        errorResponse.message = 'Something went wrong while updating the user';
        errorResponse.error = new AppError(['Something went wrong while updating the user'], StatusCodes.INTERNAL_SERVER_ERROR);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse);
    }
}

const getAllUsers = async (req, res) => {
    try {
        let userServiceInst = new userService();
        let allUsers = await userServiceInst.fetchAllUsers();
        successResponse.message = 'Successfully fetched all users';
        successResponse.data = allUsers;
        return res
            .status(StatusCodes.OK)
            .json(successResponse);
    }
    catch(err) {
        console.log(err);
        errorResponse.message = 'Something went wrong while fetching all users';
        errorResponse.error = new AppError(['Something went wrong while fetching all users'], StatusCodes.INTERNAL_SERVER_ERROR);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse);
    }
}

const getUserById = async (req, res) => {
    try {
        let userServiceInst = new userService();
        let userId = req.params.userId;
        if (!userId) {
            errorResponse.message = 'Please provide user id';
            errorResponse.error = new AppError(['User Id Missing'], StatusCodes.BAD_REQUEST);
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse);
        }
        let userDetails = await userServiceInst.fetchUser(userId);
        successResponse.message = 'Successfully fetched the user';
        successResponse.data = userDetails;
        return res
            .status(StatusCodes.OK)
            .json(successResponse);
    }
    catch(err) {
        console.log(err);
        errorResponse.message = 'Something went wrong while fetching the user';
        errorResponse.error = new AppError(['Something went wrong while fetching the user'], StatusCodes.INTERNAL_SERVER_ERROR);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse);
    }
}

const removeUser = async (req, res) => {
    try {
        let userServiceInst = new userService();
        let userId = req.params?.userId;
        if (!userId) {
            errorResponse.message = 'Please provide user id';
            errorResponse.error = new AppError(['User Id Missing'], StatusCodes.BAD_REQUEST);
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse);
        }
        let deletedUser = await userServiceInst.removeUser(userId);
        successResponse.message = 'Successfully deleted the user';
        successResponse.data = deletedUser;
        return res
            .status(StatusCodes.OK)
            .json(successResponse);
    }
    catch(err) {
        console.log(err);
        errorResponse.message = 'Something went wrong while deleting the user';
        errorResponse.error = new AppError(['Something went wrong while deleting the user'], StatusCodes.INTERNAL_SERVER_ERROR);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse);
    }
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    removeUser
};