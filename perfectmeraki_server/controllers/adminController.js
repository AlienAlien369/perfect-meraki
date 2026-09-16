const User = require("../models/User");
const Product = require("../models/Product");
const Links = require("../models/Links");
const Workshop = require("../models/Workshop");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const { asyncHandler, AppError } = require("../middleware/errorHandler");

const WORKSHOP_TYPES = [
  "corperate team building",
  "festival themed",
  "fridge magnets",
  "kids",
  "lipan art",
  "mandala",
  "nameplate",
];

// Get admin dashboard data
const getAdminDashboardData = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalAdmins,
    totalRegularUsers,
    totalProducts,
    totalWorkshops,
    productsByType,
    workshopsByType,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ role: "user" }),
    Product.countDocuments(),
    Workshop.countDocuments(),
    Product.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
    Workshop.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalAdmins,
      totalRegularUsers,
      totalProducts,
      totalWorkshops,
      productsByType,
      workshopsByType,
    },
  });
});

// Unified user management (any role) - powers the admin Users page.
const getAllUsersManaged = asyncHandler(async (req, res) => {
  const { role, search, page, limit } = req.query;
  const filter = {};
  if (role === "user" || role === "admin") filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    meta: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
});

const createUserManaged = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    throw new AppError("A user with this email already exists", 400);
  }

  const user = await User.create({ name, email, phoneNumber, password, role });

  res.status(201).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    },
  });
});

const updateUserManaged = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid user ID", 400);
  }

  const updateFields = {};
  ["name", "email", "phoneNumber", "role"].forEach((field) => {
    if (req.body[field] !== undefined) updateFields[field] = req.body[field];
  });

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({ success: true, data: updatedUser });
});

const deleteUserManaged = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.user.id === id) {
    throw new AppError("You cannot delete your own account", 400);
  }

  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({ success: true, message: "User removed successfully" });
});

// Create admin
const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password, BatchNumber } = req.body;

  const adminExists = await User.findOne({ email });
  if (adminExists) {
    throw new AppError("Admin already exists with this email", 400);
  }

  const admin = await User.create({
    name,
    email,
    phoneNumber,
    password,
    BatchNumber,
    role: "admin",
  });

  res.status(201).json({
    success: true,
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      phoneNumber: admin.phoneNumber,
      BatchNumber: admin.BatchNumber,
      role: admin.role,
    },
  });
});

// Get all admins
const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await User.find({ role: "admin" })
    .select("-password")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: admins,
  });
});

// Delete admin
const deleteAdmin = asyncHandler(async (req, res) => {
  const admin = await User.findByIdAndDelete(req.params.id);
  if (!admin) {
    throw new AppError("Admin not found", 404);
  }

  if (admin.role !== "admin") {
    throw new AppError("User is not an admin", 400);
  }

  res.status(200).json({
    success: true,
    message: "Admin removed successfully",
  });
});

// Create product
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    type,
    originalPrice,
    discountedPrice,
    category,
    stock,
  } = req.body;

  if (
    !name ||
    !description ||
    !type ||
    originalPrice === undefined ||
    discountedPrice === undefined
  ) {
    throw new AppError(
      "All required fields (name, description, image, type, originalPrice, discountedPrice) must be provided.",
      400
    );
  }

  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new AppError("Product already exists with this name", 400);
  }

  const imageFile = req.file;
  const imageUrl = imageFile && imageFile.path ? imageFile.path : "";
  const product = await Product.create({
    name,
    description,
    image: imageUrl,
    type,
    originalPrice,
    discountedPrice,
    category,
    stock,
  });

  res.status(201).json({
    success: true,
    data: product,
  });
});

// Public: list products, optionally filtered by type
const getProductsByType = asyncHandler(async (req, res) => {
  const { type } = req.body;
  const products = type
    ? await Product.find({ type })
    : await Product.find();

  res.status(200).json({
    success: true,
    data: products,
  });
});

// Delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// Edit product
const editProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid product ID", 400);
  }

  const updateFields = {};
  const allowedFields = [
    "image",
    "name",
    "type",
    "description",
    "originalPrice",
    "discountedPrice",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateFields[field] = req.body[field];
    }
  });

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    throw new AppError("Product not found", 404);
  }

  res.status(200).json({
    success: true,
    data: updatedProduct,
  });
});

// Get workshops by type (legacy/unused alias - kept for API compatibility)
const getWorkshopsByType = asyncHandler(async (req, res) => {
  const { type } = req.body;
  const workshops = type
    ? await Workshop.find({ type })
    : await Workshop.find();

  res.status(200).json({
    success: true,
    data: workshops,
  });
});

// Public: get links by name (e.g. the catalogue flipbook link)
const getLinksByName = asyncHandler(async (req, res) => {
  const { name } = req.query;
  const links = name ? await Links.find({ name }) : await Links.find();

  res.status(200).json({
    success: true,
    data: links,
  });
});

// Update links by name
const updateLinksByName = asyncHandler(async (req, res) => {
  const { name, link } = req.body;

  if (!name || !link) {
    throw new AppError("Both name and link are required to update the link.", 400);
  }

  const updatedLink = await Links.findOneAndUpdate(
    { name },
    { link },
    { new: true, runValidators: true }
  );

  if (!updatedLink) {
    throw new AppError("Link not found", 404);
  }

  res.status(200).json({
    success: true,
    data: updatedLink,
  });
});

// Create links
const createLinks = asyncHandler(async (req, res) => {
  const { name, link } = req.body;

  if (!name || !link) {
    throw new AppError("Both name and link are required to create a link.", 400);
  }

  const existingLink = await Links.findOne({ name });
  if (existingLink) {
    throw new AppError("Link with this name already exists.", 400);
  }

  const newLink = await Links.create({ name, link });

  res.status(201).json({
    success: true,
    data: newLink,
  });
});

// Public: get workshop(s) by type
const getWorkshopByType = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const workshops = type
    ? await Workshop.find({ type })
    : await Workshop.find();

  res.status(200).json({
    success: true,
    data: workshops,
  });
});

// Create Workshop
const createWorkshop = asyncHandler(async (req, res) => {
  const { name, type, description } = req.body;

  if (!name || !type || !description) {
    throw new AppError("Name, type, and description are required.", 400);
  }

  if (!req.files || !req.files.image1 || !req.files.image2 || !req.files.image3) {
    throw new AppError("All three images are required.", 400);
  }

  if (!WORKSHOP_TYPES.includes(type)) {
    throw new AppError(
      `Invalid workshop type. Allowed types: ${WORKSHOP_TYPES.join(", ")}`,
      400
    );
  }

  const newWorkshop = new Workshop({
    image1: req.files.image1[0].path,
    image2: req.files.image2[0].path,
    image3: req.files.image3[0].path,
    name: name.trim(),
    type,
    description: description.trim(),
  });

  const savedWorkshop = await newWorkshop.save();
  res.status(201).json({ success: true, data: savedWorkshop });
});

// Update Workshop by ID
const updateWorkshop = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, type, description } = req.body;

  const existingWorkshop = await Workshop.findById(id);
  if (!existingWorkshop) {
    throw new AppError("Workshop not found", 404);
  }

  if (type && !WORKSHOP_TYPES.includes(type)) {
    throw new AppError(
      `Invalid workshop type. Allowed types: ${WORKSHOP_TYPES.join(", ")}`,
      400
    );
  }

  const updatedData = {
    name: name ? name.trim() : existingWorkshop.name,
    type: type || existingWorkshop.type,
    description: description ? description.trim() : existingWorkshop.description,
    image1: existingWorkshop.image1,
    image2: existingWorkshop.image2,
    image3: existingWorkshop.image3,
  };

  const files = req.files || {};
  for (const field of ["image1", "image2", "image3"]) {
    if (files[field]) {
      const existingUrl = existingWorkshop[field];
      if (existingUrl) {
        const publicId = existingUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`ProductsPhotos/${publicId}`);
      }
      updatedData[field] = files[field][0].path;
    }
  }

  const updatedWorkshop = await Workshop.findByIdAndUpdate(id, updatedData, {
    new: true,
  });
  res.status(200).json({ success: true, data: updatedWorkshop });
});

// Delete Workshop
const deleteWorkshop = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existingWorkshop = await Workshop.findById(id);
  if (!existingWorkshop) {
    throw new AppError("Workshop not found", 404);
  }

  const getPublicId = (url) => {
    if (!url) return null;
    const parts = url.split("/");
    const filename = parts.pop();
    const publicId = filename.split(".")[0];
    return `${parts.slice(parts.indexOf("ProductsPhotos")).join("/")}/${publicId}`;
  };

  for (const field of ["image1", "image2", "image3"]) {
    if (existingWorkshop[field]) {
      await cloudinary.uploader.destroy(getPublicId(existingWorkshop[field]));
    }
  }

  await Workshop.findByIdAndDelete(id);

  res.status(200).json({ success: true, message: "Workshop deleted successfully" });
});

module.exports = {
  getAdminDashboardData,
  getAllUsersManaged,
  createUserManaged,
  updateUserManaged,
  deleteUserManaged,
  createAdmin,
  getAllAdmins,
  deleteAdmin,
  createProduct,
  getProductsByType,
  deleteProduct,
  editProduct,
  getWorkshopsByType,
  getLinksByName,
  updateLinksByName,
  createLinks,
  getWorkshopByType,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
};
