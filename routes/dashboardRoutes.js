const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const {
    superadminDashboard,
    adminDashboard,
    userDashboard
} = require('../controllers/dashboardController');

// Super Admin dashboard
router.get(
    '/superadmin/dashboard',
    protect,
    authorize('superadmin'),
    superadminDashboard
);

// CEO dashboard
router.get(
    '/admin/dashboard',
    protect,
    authorize('admin'),
    adminDashboard
);

// Branch Manager dashboard
router.get(
    '/user/dashboard',
    protect,
    authorize('user'),
    userDashboard
);

module.exports = router;