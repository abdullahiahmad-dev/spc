const Customer = require('../models/Customer');

// Display customer registration page
exports.getAddCustomer = (req, res) => {
    res.render('user/addCustomer', {
        user: req.user,
        error: null
    });
};


// Register a new customer
exports.createCustomer = async (req, res) => {
    try {
        const {
            customerName,
            customerType,
            phone,
            email,
            address,
            wasteSource,
            notes
        } = req.body;

        // Validate required fields
        if (!customerName || !customerType || !phone || !address) {
            return res.status(400).render('user/addCustomer', {
                user: req.user,
                error: 'Please complete all required fields.'
            });
        }

        // Ensure the manager has an assigned branch
        if (!req.user.branch) {
            return res.status(403).send(
                'Your account has no assigned branch.'
            );
        }

        // Create customer under the manager's own branch
        await Customer.create({
            customerName: customerName.trim(),
            customerType,
            phone: phone.trim(),
            email: email ? email.trim().toLowerCase() : '',
            address: address.trim(),
            wasteSource: wasteSource || '',
            notes: notes || '',
            branch: req.user.branch,
            createdBy: req.user._id
        });

        res.redirect('/customers');

    } catch (error) {
        console.error('Customer registration error:', error);

        res.status(500).render('/addCustomer', {
            user: req.user,
            error: 'Unable to register customer. Please try again.'
        });
    }
};


// Display customers belonging to the logged-in manager's branch
exports.getCustomers = async (req, res) => {
    try {
        if (!req.user.branch) {
            return res.status(403).send(
                'Your account has no assigned branch.'
            );
        }

        const customers = await Customer.find({
            branch: req.user.branch
        })
        .populate('createdBy', 'fullName')
        .sort({ createdAt: -1 });

        res.render('user/customers', {
            user: req.user,
            customers
        });

    } catch (error) {
        console.error('Load customers error:', error);
        res.status(500).send('Unable to load customers.');
    }
};