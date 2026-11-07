exports.superadminDashboard = (req, res) => {
    res.render('superadmin/dashboard', {
        user: req.user
    });
};

exports.adminDashboard = (req, res) => {
    res.render('admin/dashboard', {
        user: req.user
    });
};

exports.userDashboard = async (req, res) => {
    try {
        const User = require('../models/User');

        const manager = await User.findById(req.user._id)
            .populate('branch');

        if (!manager) {
            return res.redirect('/login');
        }

        res.render('user/dashboard', {
            user: manager,
            branch: manager.branch
        });

    } catch (error) {
        console.error('Branch dashboard error:', error);
        res.status(500).send('Unable to load Branch Manager dashboard.');
    }
};