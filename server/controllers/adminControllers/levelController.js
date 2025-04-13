const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const Level = require('../../models/Level');
const Department = require('../../models/Department');


exports.createLevel = catchAsync(async (req, res, next) => {
    const { name, departmentId } = req.body;

    if (!name || !departmentId) {
        return next(new ApiError('Level name and department ID are required', 400));
    }

    // Normalize level name (trim, lowercase, and replace multiple spaces with a single space)
    const formattedLevelName = name.trim().toUpperCase().replace(/\s+/g, ' ');

    // Check if department exists
    const department = await Department.findById(departmentId);
    if (!department) {
        return next(new ApiError('Department not found', 404));
    }

    // Check if level already exists under this department
    const levelExists = await Level.findOne({ name: formattedLevelName, departmentId });
    if (levelExists) {
        return next(new ApiError('Level already exists in this department', 409));
    }

    // Create new level with auto-generated _id
    const level = await Level.create({ name: formattedLevelName, departmentId });

    res.status(201).json({
        status: 'success',
        data: level
    });
});




exports.getAllLevelsByDepartment = catchAsync(async (req, res, next) => {
    const { departmentId } = req.params;

    if (!departmentId) {
        return next(new ApiError('Department ID is required', 400));
    }

    // Check if department exists
    const department = await Department.findById(departmentId);
    if (!department) {
        return next(new ApiError('Department not found', 404));
    }

    // Find levels under this department
    const levels = await Level.find({ departmentId }).select('_id name');

    res.status(200).json({
        status: 'success',
        results: levels.length,
        data: levels
    });
});



