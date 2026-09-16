const User = require("../models/User");
const Product = require("../models/Product");
const Workshop = require("../models/Workshop");
const { asyncHandler, AppError } = require("../middleware/errorHandler");

// Get user dashboard data
const getUserDashboardData = asyncHandler(async (req, res) => {
  const [totalProducts, totalWorkshops, totalUsers] = await Promise.all([
    Product.countDocuments(),
    Workshop.countDocuments(),
    User.countDocuments({ role: "user" }),
  ]);

  res.status(200).json({
    success: true,
    data: { totalProducts, totalWorkshops, totalUsers },
  });
});

// Get all users - supports optional ?page=&limit= pagination; omitting both
// keeps the original "return everything" behavior existing callers rely on.
const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  if (!page && !limit) {
    const users = await User.find({ role: "user" }).select("-password");
    return res.status(200).json({ success: true, data: users });
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  const [users, total] = await Promise.all([
    User.find({ role: "user" })
      .select("-password")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    User.countDocuments({ role: "user" }),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    meta: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role !== "user") {
    throw new AppError("User is not a user", 400);
  }

  res.status(200).json({
    success: true,
    message: "User removed successfully",
  });
});

module.exports = {
  getUserDashboardData,
  getAllUsers,
  deleteUser,
};
