const express = require('express');
const router = express.Router();
const { register, login, refresh, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../schemas/authSchemas');
const { authLimiter } = require('../middleware/rateLimiter');

// Public routes
router.post('/register', authLimiter, validateBody(registerSchema), register);
router.post('/login', authLimiter, validateBody(loginSchema), login);
router.post('/refresh', authLimiter, refresh);
router.post('/logout', logout);

// Protected route example
router.get('/me', protect, (req, res) => {
    res.json({
        success: true,
        data: req.user
    });
});

module.exports = router;
