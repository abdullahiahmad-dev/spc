const User = require('../models/User');
const Branch = require('../models/Branch');

// Display all branches
exports.getBranches = async (req, res) => {
    try {
        const branches = await Branch.find().sort({ createdAt: -1 });

        res.render('superadmin/branches', {
            user: req.user,
            branches
        });

    } catch (error) {
        console.error('Load branches error:', error);
        res.status(500).send('Unable to load branches.');
    }
};

// Create a new branch
exports.createBranch = async (req, res) => {
    try {
        const {
            branchName,
            branchCode,
            location,
            address,
            phone
        } = req.body;

        if (!branchName || !branchCode || !location) {
            return res.status(400).send(
                'Branch name, branch code and location are required.'
            );
        }

        const existingBranch = await Branch.findOne({
            $or: [
                { branchName: branchName.trim() },
                { branchCode: branchCode.trim().toUpperCase() }
            ]
        });

        if (existingBranch) {
            return res.status(409).send(
                'A branch with this name or code already exists.'
            );
        }

        await Branch.create({
            branchName: branchName.trim(),
            branchCode: branchCode.trim().toUpperCase(),
            location: location.trim(),
            address: address ? address.trim() : '',
            phone: phone ? phone.trim() : ''
        });

        res.redirect('/superadmin/branches');

    } catch (error) {
        console.error('Create branch error:', error);

        if (error.code === 11000) {
            return res.status(409).send(
                'Branch name or code already exists.'
            );
        }

        res.status(500).send('Unable to create branch.');
    }
};

// Display all CEO accounts
exports.getAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' })
            .select('-password')
            .sort({ createdAt: -1 });

        res.render('superadmin/admins', {
            user: req.user,
            admins,
            error: null,
            success: null
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Unable to load CEO accounts.');
    }
};

// Create CEO account
exports.createAdmin = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;

        if (!fullName || !username || !email || !password) {
            return res.status(400).send('All fields are required.');
        }

        if (password.length < 8) {
            return res.status(400).send('Password must be at least 8 characters.');
        }

        // Check whether username or email already exists
        const existingUser = await User.findOne({
            $or: [
                { username: username.trim().toLowerCase() },
                { email: email.trim().toLowerCase() }
            ]
        });

        if (existingUser) {
            return res.status(409).send(
                'Username or email already exists.'
            );
        }

        const admin = await User.create({
            fullName: fullName.trim(),
            username: username.trim().toLowerCase(),
            email: email.trim().toLowerCase(),
            password,
            role: 'admin',
            branch: null,
            isActive: true,
            mustChangePassword: true
        });

        console.log('CEO account created:', admin.email);

        res.redirect('/superadmin/admins');

    } catch (error) {
        console.error('Create CEO error:', error);

        if (error.code === 11000) {
            return res.status(409).send(
                'Username or email already exists.'
            );
        }

        res.status(500).send('Unable to create CEO account.');
    }
};

// Display Branch Managers and account creation form
exports.getManagers = async (req, res) => {
    try {
        const managers = await User.find({ role: 'user' })
            .populate('branch', 'branchName branchCode')
            .sort({ createdAt: -1 });

        const branches = await Branch.find({ isActive: true })
            .sort({ branchName: 1 });

        res.render('superadmin/managers', {
            user: req.user,
            managers,
            branches
        });

    } catch (error) {
        console.error('Load managers error:', error);
        res.status(500).send('Unable to load Branch Managers.');
    }
};


// Create Branch Manager account
exports.createManager = async (req, res) => {
    try {
        const {
            fullName,
            username,
            email,
            password,
            branch
        } = req.body;

        if (!fullName || !username || !email || !password || !branch) {
            return res.status(400).send('All fields are required.');
        }

        if (password.length < 8) {
            return res.status(400).send(
                'Password must be at least 8 characters.'
            );
        }

        // Confirm that the selected branch exists and is active
        const selectedBranch = await Branch.findOne({
            _id: branch,
            isActive: true
        });

        if (!selectedBranch) {
            return res.status(400).send(
                'Selected branch does not exist or is inactive.'
            );
        }

        // Check for duplicate username or email
        const existingUser = await User.findOne({
            $or: [
                { username: username.trim().toLowerCase() },
                { email: email.trim().toLowerCase() }
            ]
        });

        if (existingUser) {
            return res.status(409).send(
                'Username or email already exists.'
            );
        }

        const manager = await User.create({
            fullName: fullName.trim(),
            username: username.trim().toLowerCase(),
            email: email.trim().toLowerCase(),
            password,
            role: 'user',
            branch: selectedBranch._id,
            isActive: true,
            mustChangePassword: true
        });

        console.log('Branch Manager created:', manager.email);

        res.redirect('/superadmin/managers');

    } catch (error) {
        console.error('Create manager error:', error);

        if (error.code === 11000) {
            return res.status(409).send(
                'Username or email already exists.'
            );
        }

        res.status(500).send('Unable to create Branch Manager.');
    }
};