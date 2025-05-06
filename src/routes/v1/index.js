const express = require('express');
const router = express.Router();
const { authController, gatePassController } = require('../../controllers/index');
const authMW = require('../../middlewares/auth');

router.get('/test', (req, res) => {
    console.log('Request is coming !');
    res.status(200).json({
        success: true
    });
});

router.post('/login', authController.handleLogin);
router.post('/logout', authMW.authenticateJWT, authController.handleLogout);
router.put('/changepassword', authMW.authenticateJWT, authController.changePassword);
router.post('/gatepass', authMW.authenticateJWT, authMW.verifyRole('student'), gatePassController.createGatePass);
router.get('/gatepass', authMW.authenticateJWT, authMW.verifyRole('student'), gatePassController.getGatePassesByUser);
router.get('/gatepass/pending', authMW.authenticateJWT, authMW.verifyRole('student'), gatePassController.getPendingGatePassesByUser);
router.get('/gatepass/approved', authMW.authenticateJWT, authMW.verifyRole('student'), gatePassController.getApprovedGatePassesByUser);
router.get('/approvals/pending', authMW.authenticateJWT, authMW.verifyApprover, gatePassController.getPendingApprovalsByApprover);
router.put('/approvals/approve/:gatePassId', authMW.authenticateJWT, authMW.verifyApprover, gatePassController.approveGatePass);
router.get('/approvals/approved', authMW.authenticateJWT, authMW.verifyApprover, gatePassController.getApprovedApprovalsByApprover);

module.exports = router;