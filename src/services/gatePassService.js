const gatePassRepository = require('../repository/gatePassRepository');
const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/AppError');
const inviteSchedulerService = require('./inviteScheduler');
const userService = require('./userService');

class gatePassService {
    constructor() {
        this.gatePassRepositoryInst = new gatePassRepository();
        this.inviteSchedulerServiceInst = new inviteSchedulerService();
        this.userServiceInst = new userService();
    }
    
    async createGatePass(gatePassDetails) {
        try {
            console.log('gatePassDetails::', gatePassDetails);
            let approvers = await this.userServiceInst.fetchApprovers(gatePassDetails?.dept);
            let filteredGatePassData = {
                name: gatePassDetails?.name,
                email: gatePassDetails?.email,
                department: gatePassDetails?.dept,
                userId: gatePassDetails?.userId,
                applyReason: gatePassDetails?.applyReason,
                date: gatePassDetails?.date,
                duration: gatePassDetails?.duration,
                approvers: approvers
            };
            console.log('approvers::', approvers);
            let gatePass = await this.gatePassRepositoryInst.insertOne(filteredGatePassData);//await this.gatePassRepositoryInst.create(gatePassDetails);
            console.log('GatePass Inserted::', gatePass);
            return gatePass;
        }
        catch(err) {
            console.log("🚀 ~ gatePassService ~ createGatePass ~ err:", err);
            return Promise.reject(err);
        }
    }

    async getPendingApprovalsByApprover(approverId, skip, limit) {
        try {
            console.log('approverId::', approverId);
            let pendingApprovals = await this.gatePassRepositoryInst.getPendingApprovalsByApprover(approverId, skip, limit);//await this.gatePassRepositoryInst.getAll({approvers: approverId, status: 'pending'});
            return pendingApprovals;
        }
        catch(err) {
            console.log('fetchPendingApprovals err', err);
            return Promise.reject(err);
        }
    }

    async getApprovedApprovalsByApprover(approverId, skip, limit) {
        try {
            let approvedApprovals = await this.gatePassRepositoryInst.getApprovedApprovalsByApprover(approverId, skip, limit);//await this.gatePassRepositoryInst.getAll({approvers: approverId, status: 'approved'});
            return approvedApprovals;
        }
        catch(err) {
            console.log('fetchApprovedApprovals err', err);
            return Promise.reject(err);
        }
    }

    async getGatePassesByUser(userId, skip, limit, isViewAll) {
        try {
            let fetchedGatePasses = await this.gatePassRepositoryInst.getGatePassesByUser(userId, skip, limit);
            return fetchedGatePasses;
        }
        catch(err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    async getPendingGatePassesByUser(userId, skip, limit) {
        try {
            let pendingGatePasses = await this.gatePassRepositoryInst.getPendingGatePassesByUser(userId, skip, limit);//await this.gatePassRepositoryInst.getAll({userId: userId, status: 'pending'});
            return pendingGatePasses;
        }
        catch(err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    async getApprovedGatePassesByUser(userId, skip, limit) {
        try {
            let approvedGatePasses = await this.gatePassRepositoryInst.getApprovedGatePassesByUser(userId, skip, limit);//await this.gatePassRepositoryInst.getAll({userId: userId, status: 'pending'});
            return approvedGatePasses;
        }
        catch(err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    async approveGatePassRequest(gatePassId) {
        try {
            let approveGatePass = await this.gatePassRepositoryInst.approveGatePass(gatePassId);
            return approveGatePass;
        }
        catch(err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

}

module.exports = gatePassService;