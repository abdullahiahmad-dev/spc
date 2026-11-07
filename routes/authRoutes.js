const express = require('express');
const router = express.Router();

const {
  getLogin,
  login,
  logout
} = require('../controllers/authController');

router.get('/login', getLogin);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;