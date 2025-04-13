const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const Department = require('../../models/Department');


exports.createDepartment = catchAsync(async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        return next(new ApiError('Name is required', 400)); // 400 Bad Request
    }

    // Normalize name for consistent storage
    const formattedName = name.trim().toUpperCase().replace(/\s+/g, ' ');

    // Check if department already exists
    const departmentExists = await Department.findOne({ name: formattedName });
    if (departmentExists) {
        return next(new ApiError('Department already exists', 409)); // 409 Conflict
    }

    // Create new department with auto-generated _id
    const department = await Department.create({ name: formattedName });

    res.status(201).json({
        status: 'success',
        data: department
    });
});



exports.getAllDepartments = catchAsync(async (req, res, next) => {
    const departments = await Department.find().select('_id name');

    res.status(200).json({
        status: 'success',
        results: departments.length,
        data: departments
    });
});
