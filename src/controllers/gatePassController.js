const _ = require('lodash');
const { gatePassService } = require('../services/index'); 
const { StatusCodes } = require('http-status-codes');
const { successResponse, errorResponse } = require('../utils/common');
const AppError = require('../utils/errors/AppError');
const { publishJob }  = require('../GatePassQ/producer');

const createGatePass = async (req, res) => {
    try {
        let self = this;
        console.log('Inside create GatePass');
        const gatePassServiceInst = new gatePassService();
        if(!req.body?.applyReason || !req.body?.date || !req.body?.duration) {
            errorResponse.message = "Incomplete Data to process the request";
            errorResponse.error = new AppError(["Incomplete Data to process the request"], StatusCodes.BAD_REQUEST);         
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse);
        }
        
        let reqBody = _.cloneDeep(req.body);
        self.userContext = req?.userContext;
        req.body.userId = req?.userContext?._id;
        req.body.jobType = "Process GatePass Request";
        console.log('req.body::', req.body);
        console.log('req.userContext::', req.userContext);
        publishJob.call(self, req.body)
        .then(() => {
            console.log("Job published successfully");
        })
        .catch((err) => {
            console.error(err);
        });

        return res
                .status(StatusCodes.OK)
                .json(successResponse(reqBody, "GatePass created successfully"));
    }
    catch(err) {
        console.log("🚀 ~ createGatePass ~ err:", err);
        errorResponse.message = "Something went wrong while creating gatepass";
        errorResponse.error = new AppError(["Something went wrong while creating gatepass"], StatusCodes.INTERNAL_SERVER_ERROR);         
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse);
    }
};

const getPendingApprovalsByApprover = async (req, res) => {
    try {
        let approverId = req?.userContext?._id;
        if(!approverId) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({'message': 'Could not find approverId, Invalid Access Token'});
        }
        let skip;
        let limit;
        if(req.query?.skip && req.query?.limit) {
            skip = parseInt(req.query.skip);
            limit = parseInt(req.query.limit);
            if(skip < 0 || limit < 0) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({'message': 'Skip and limit should be greater than 0'});
            }
        }
        const gatePassServiceInst = new gatePassService();
        let pendingApprovals = await gatePassServiceInst.getPendingApprovalsByApprover(approverId, skip, limit);
        if(!pendingApprovals) {
            pendingApprovals = [];
        }
        return res
                .status(StatusCodes.OK)
                .json(successResponse(pendingApprovals, "Pending approvals fetched successfully"));
    }
    catch(err) {
        console.log("🚀 ~ fetch pending ~ err:", err);
        errorResponse.message = "Something went wrong while fetching pending gatepass";
        errorResponse.error = new AppError(["Something went wrong while fetching pending gatepass"], StatusCodes.INTERNAL_SERVER_ERROR);         
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse);
    }
};

const getApprovedApprovalsByApprover = async (req, res) => {
    try {
        let approverId = req?.userContext?._id;
        if(!approverId) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({'message': 'Could not find approverId, Invalid Access Token'});
        }
        let skip;
        let limit;
        if(req.query?.skip && req.query?.limit) {
            skip = parseInt(req.query.skip);
            limit = parseInt(req.query.limit);
            if(skip < 0 || limit < 0) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({'message': 'Skip and limit should be greater than 0'});
            }
        }
        const gatePassServiceInst = new gatePassService();
        let approvedApprovals = await gatePassServiceInst.getApprovedApprovalsByApprover(approverId, skip, limit);
        if(!approvedApprovals) {
            approvedApprovals = [];
        }
        return res
                .status(StatusCodes.OK)
                .json(successResponse(approvedApprovals, "Approved approvals fetched successfully"));
    }
    catch(err) {
        console.log("🚀 ~ fetch approved ~ err:", err);
        errorResponse.message = "Something went wrong while fetching approved gatepass";
        errorResponse.error = new AppError(["Something went wrong while fetching approved gatepass"], StatusCodes.INTERNAL_SERVER_ERROR);         
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse);
    }
};

const getGatePassesByUser = async (req, res) => {
    try {
        let userId = req?.userContext?._id;
        if(!userId){
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({'message': 'Could not find userId, Invalid Access Token'});
        }
        let skip;
        let limit;
        if(req.query?.skip && req.query?.limit) {
            skip = parseInt(req.query.skip);
            limit = parseInt(req.query.limit);
            if(skip < 0 || limit < 0) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({'message': 'Skip and limit should be greater than 0'});
            }
        }
        const gatePassServiceInst = new gatePassService();
        let fetchedGatePasses = await gatePassServiceInst.getGatePassesByUser(userId, skip, limit);
        if(!fetchedGatePasses) {
            fetchedGatePasses = []
        }
        return res
            .status(StatusCodes.OK)
            .json(successResponse(fetchedGatePasses, "GatePasses fetched successfully"));
    }
    catch(err) {
        errorResponse.message = "Something went wrong while getting user gatepasses";
        errorResponse.error = new AppError(["Something went wrong while getting user gatepasses"], StatusCodes.INTERNAL_SERVER_ERROR);         
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse);
    }
};

const getPendingGatePassesByUser = async (req, res) => {
    try {
        let userId = req?.userContext?._id;
        if(!userId){
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({'message': 'Could not find userId, Invalid Access Token'});
        }
        let skip;
        let limit;
        if(req.query?.skip && req.query?.limit) {
            skip = parseInt(req?.query?.skip);
            limit = parseInt(req.query.limit);
            if(skip < 0 || limit < 0) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({'message': 'Skip and limit should be greater than 0'});
            }
        }
        const gatePassServiceInst = new gatePassService();
        let pendingGatePasses = await gatePassServiceInst.getPendingGatePassesByUser(userId, skip, limit);
        if(!pendingGatePasses) {
            pendingGatePasses = [];
        }
        return res
            .status(StatusCodes.OK)
            .json(successResponse(pendingGatePasses, "Pending gatepasses fetched successfully"));
    }
    catch(err) {
        errorResponse.message = "Something went wrong while getting pending gatepasses";
        errorResponse.error = new AppError(["Something went wrong while getting pending gatepasses"], StatusCodes.INTERNAL_SERVER_ERROR);         
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse);
    }
};

const getApprovedGatePassesByUser = async (req, res) => {
    try {
        let userId = req?.userContext?._id;
        if(!userId){
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({'message': 'Could not find userId, Invalid Access Token'});
        }
        let skip;
        let limit;
        if(req.query?.skip && req.query?.limit) {
            skip = parseInt(req.query.skip);
            limit = parseInt(req.query.limit);
            if(skip < 0 || limit < 0) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({'message': 'Skip and limit should be greater than 0'});
            }
        }
        const gatePassServiceInst = new gatePassService();
        let pendingGatePasses = await gatePassServiceInst.getApprovedGatePassesByUser(userId, skip, limit);
        if(!pendingGatePasses) {
            pendingGatePasses = [];
        }
        return res
            .status(StatusCodes.OK)
            .json(successResponse(pendingGatePasses, "Approved gatepasses fetched successfully"));
    }
    catch(err) {
        errorResponse.message = "Something went wrong while getting pending gatepasses";
        errorResponse.error = new AppError(["Something went wrong while getting pending gatepasses"], StatusCodes.INTERNAL_SERVER_ERROR);         
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse);
    }
};

const approveGatePass = async (req, res) => {
    try {
        if(!req.params.gatePassId) {
            errorResponse.message = "GatePassId is missing";
            errorResponse.error = new AppError(["GatePassId is missing"], StatusCodes.BAD_REQUEST);
            return res 
                    .status(StatusCodes.BAD_REQUEST)
                    .json(errorResponse);
        }
        const gatePassServiceInst = new gatePassService();
        let approvedGatePass = await gatePassServiceInst.approveGatePassRequest(req.params.gatePassId);
        console.log("Its approved gatepass request:", approvedGatePass);
        return res
                .status(StatusCodes.OK)
                .json(successResponse(approvedGatePass, "GatePass approved successfully"));
    }
    catch(err) {
        console.log(err);
        errorResponse.message = "Something went wrong while approving the gatepass request";
        errorResponse.error = new AppError(["Something went wrong while approving the gatepass request"], StatusCodes.INTERNAL_SERVER_ERROR);         
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse);
    }
}

module.exports = {
    createGatePass,
    approveGatePass,
    getPendingApprovalsByApprover,
    getApprovedApprovalsByApprover,
    getGatePassesByUser,
    getPendingGatePassesByUser,
    getApprovedGatePassesByUser
};
