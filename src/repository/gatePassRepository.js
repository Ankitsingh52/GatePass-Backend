const { gatePass } = require('../models/index');
const crudRepository = require('./crudRepository');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

class gatePassRepository extends crudRepository {
    constructor() {
        super(gatePass);
    }
    // async create(data) {
    //     // console.log('data::', data);
    //     // let gatePass = await this.
    //     return {
    //         success: true
    //     };
    // }
    // async getAllByDateDesc(query, proj) {
    // try {
    //     const response = await this.model.find(query, proj).sort({mOn: -1});
    //     if(!response){
    //         throw new AppError(['Not able to find the resource'], StatusCodes.NOT_FOUND);
    //     }
    //     console.log('resp getAll::', response);
    //     return response;
    // }
    // catch(err) {
    //     console.log(err);
    //     return err;
    // }
    // }
    async getPendingApprovalsByApprover(approverId, skip, limit) {
        try {
            if(skip && limit) {
                let pendingApprovals = await gatePass.find({ approvers: new ObjectId(approverId), status: 'pending' }).sort({ cOn: -1, mOn: -1 }).skip(skip).limit(limit);
                return pendingApprovals;
            }
            let pendingApprovals = await gatePass.find({ approvers: new ObjectId(approverId), status: 'pending' }).sort({ cOn: -1, mOn: -1 });
            return pendingApprovals;
        }
        catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    async getApprovedApprovalsByApprover(approverId, skip, limit) {
        try {
            if(skip && limit) {
                let pendingApprovals = await gatePass.find({ approvers: new ObjectId(approverId), status: 'approved' }).sort({ cOn: -1, mOn: -1 }).skip(skip).limit(limit);
                return pendingApprovals;
            }
            let pendingApprovals = await gatePass.find({ approvers: new ObjectId(approverId), status: 'approved' }).sort({ cOn: -1, mOn: -1 });
            return pendingApprovals;
        }
        catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    async getGatePassesByUser(userId, skip, limit) {
        try {
            if(skip && limit) {
                console.log('skip::', skip);
                console.log('limit::', limit);
                let gatePasses = await gatePass.find({ userId: userId }).sort({ cOn: -1, mOn: -1 }).skip(skip).limit(limit);
                return gatePasses;
            }
            console.log('Non skip and limit');
            let gatePasses = await gatePass.find({ userId: userId }).sort({ cOn: -1, mOn: -1 });
            return gatePasses;
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    async getPendingGatePassesByUser(userId, skip, limit) {
        try {
            if(skip && limit) {
                let pendingGatePasses = await gatePass.find({ userId: userId, status: 'pending' }).sort({ cOn: -1, mOn: -1 }).skip(skip).limit(limit);
                return pendingGatePasses;
            }
            let pendingGatePasses = await gatePass.find({ userId: userId, status: 'pending' }).sort({ cOn: -1, mOn: -1 });
            return pendingGatePasses;
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    async getApprovedGatePassesByUser(userId, skip, limit) {
        try {
            if(skip && limit) {
                let approvedGatePasses = await gatePass.find({ userId: userId, status: 'approved' }).sort({ cOn: -1, mOn: -1 }).skip(skip).limit(limit);
                return approvedGatePasses;
            }
            let approvedGatePasses = await gatePass.find({ userId: userId, status: 'approved' }).sort({ cOn: -1, mOn: -1 });
            return approvedGatePasses;
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    async approveGatePass(gatePassId) {
        try {
            let approvedGatePass = await this.update(
                { _id: new mongoose.Types.ObjectId(gatePassId) }, 
                { $set: { status: 'approved', mOn: new Date() } }
            );
            return approvedGatePass;
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

}

module.exports = gatePassRepository;