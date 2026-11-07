const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Display login page
exports.getLogin = (req, res) => {
  res.render('auth/login', {
    error: null
  });
};

// Process login
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).render('auth/login', {
        error: 'Please enter your username/email and password.'
      });
    }

    const loginIdentifier = identifier.trim().toLowerCase();

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: loginIdentifier },
        { email: loginIdentifier }
      ]
    }).select('+password');

    if (!user) {
      return res.status(401).render('auth/login', {
        error: 'Invalid username/email or password.'
      });
    }

    if (!user.isActive) {
      return res.status(403).render('auth/login', {
        error: 'Your account has been deactivated. Contact the administrator.'
      });
    }

    // Compare entered password with hashed password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).render('auth/login', {
        error: 'Invalid username/email or password.'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
      }
    );

    // Store JWT in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    // Redirect according to user role
    if (user.role === 'superadmin') {
      return res.redirect('/superadmin/dashboard');
    }

    if (user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    }

    if (user.role === 'user') {
      return res.redirect('/user/dashboard');
    }

    return res.status(403).send('Unrecognized account role.');

  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).render('auth/login', {
      error: 'Something went wrong. Please try again.'
    });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  res.redirect('/login');
};