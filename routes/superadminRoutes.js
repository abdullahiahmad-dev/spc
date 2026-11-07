const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');



const {
    getAdmins,
    createAdmin,
    getBranches,
    createBranch,
    getManagers,
    createManager
} = require('../controllers/superadminController');

// All routes in this file require Super Admin access
router.use(protect, authorize('superadmin'));

// CEO management
router.get('/admins', getAdmins);
router.post('/admins/create', createAdmin);
// Branch management
router.get('/branches', getBranches);
router.post('/branches/create', createBranch);

// Branch Manager management
router.get('/managers', getManagers);
router.post('/managers/create', createManager);

module.exports = router;