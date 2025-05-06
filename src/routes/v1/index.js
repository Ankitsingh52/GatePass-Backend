const express = require('express');
const router = express.Router();
const { authController, gatePassController, userController } = require('../../controllers/index');
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
router.post('/gatepasses', authMW.authenticateJWT, authMW.verifyRole('student'), gatePassController.createGatePass);
router.get('/gatepasses', authMW.authenticateJWT, authMW.verifyRole('student'), gatePassController.getGatePassesByUser);
router.get('/gatepasses/pending', authMW.authenticateJWT, authMW.verifyRole('student'), gatePassController.getPendingGatePassesByUser);
router.get('/gatepasses/approved', authMW.authenticateJWT, authMW.verifyRole('student'), gatePassController.getApprovedGatePassesByUser);
router.get('/approvals/pending', authMW.authenticateJWT, authMW.verifyApprover, gatePassController.getPendingApprovalsByApprover);
router.put('/approvals/approve/:gatePassId', authMW.authenticateJWT, authMW.verifyApprover, gatePassController.approveGatePass);
router.get('/approvals/approved', authMW.authenticateJWT, authMW.verifyApprover, gatePassController.getApprovedApprovalsByApprover);
router.get('/admin/users', authMW.authenticateJWT, authMW.verifyRole('admin'), userController.getAllUsers);
router.get('/admin/users/:userId', authMW.authenticateJWT, authMW.verifyRole('admin'), userController.getUserById);
router.post('/admin/users', authMW.authenticateJWT, authMW.verifyRole('admin'), userController.createUser);
router.put('/admin/users/:userId', authMW.authenticateJWT, authMW.verifyRole('admin'), userController.updateUser);
router.delete('/admin/users/:userId', authMW.authenticateJWT, authMW.verifyRole('admin'), userController.removeUser);


module.exports = router;