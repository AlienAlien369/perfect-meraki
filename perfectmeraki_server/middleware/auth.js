const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler, AppError } = require('./errorHandler');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new AppError('Not authorized to access this route', 401);
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        throw new AppError('Not authorized to access this route', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        throw new AppError('Not authorized to access this route', 401);
    }

    req.user = user;
    next();
});

// Middleware for role authorization
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new AppError(
                `User role ${req.user.role} is not authorized to access this route`,
                403
            );
        }
        next();
    };
};

module.exports = { protect, authorize };
