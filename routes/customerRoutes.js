
const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const {
    getAddCustomer,
    createCustomer,
    getCustomers
} = require('../controllers/customerController');

// Only logged-in Branch Managers can access these routes
router.use(protect, authorize('user'));

// Display customer registration page
router.get('/customers/new', getAddCustomer);

// Process customer registration
router.post('/customers/create', createCustomer);

// Display branch customers
router.get('/customers', getCustomers);

module.exports = router;
