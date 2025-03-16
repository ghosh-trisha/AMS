const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const Category = require('../../models/Category');

exports.createCategory = catchAsync(async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        return next(new ApiError('Category name is required', 400));
    }

    // Normalize category name (trim, lowercase, and replace multiple spaces with a single space)
    const formattedCategoryName = name.trim().toLowerCase().replace(/\s+/g, ' ');

    // Check if category already exists
    const categoryExists = await Category.findOne({ name: formattedCategoryName });
    if (categoryExists) {
        return next(new ApiError('Category already exists', 409));
    }

    // Create new category
    const category = await Category.create({ name: formattedCategoryName });

    res.status(201).json({
        status: 'success',
        data: category
    });
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
    // Get all categories
    const categories = await Category.find().select('_id name');

    res.status(200).json({
        status: 'success',
        results: categories.length,
        data: categories
    });
});
