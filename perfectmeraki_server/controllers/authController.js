const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { asyncHandler, AppError } = require("../middleware/errorHandler");
const { refreshCookieOptions } = require("../config/cookies");

const sendAuthResponse = (res, statusCode, user) => {
  const token = user.getSignedJwtToken();
  const refreshToken = user.getSignedRefreshToken();

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    },
  });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  const user = await User.create({ name, email, phoneNumber, password });
  sendAuthResponse(res, 201, user);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError("Invalid credentials", 400);
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  sendAuthResponse(res, 200, user);
});

// Reads the httpOnly refresh cookie and issues a new short-lived access token.
const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw new AppError("No refresh token provided", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );
  } catch {
    res.clearCookie("refreshToken", refreshCookieOptions);
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    res.clearCookie("refreshToken", refreshCookieOptions);
    throw new AppError("User no longer exists", 401);
  }

  const newToken = user.getSignedJwtToken();
  res.status(200).json({
    success: true,
    token: newToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", refreshCookieOptions);
  res.status(200).json({ success: true, message: "Logged out" });
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email, phoneNumber },
    { new: true, runValidators: true }
  ).select("-password");

  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  updateProfile,
};
