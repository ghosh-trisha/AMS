const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const Course = require('../../models/Course');
const Program = require('../../models/Program');

exports.createCourse = catchAsync(async (req, res, next) => {
    const { name, programId } = req.body;

    if (!name || !programId) {
        return next(new ApiError('Course name and Program ID are required', 400));
    }

    // Normalize course name (trim, lowercase, and replace multiple spaces with a single space)
    const formattedCourseName = name.trim().toLowerCase().replace(/\s+/g, ' ');

    // Check if the program exists
    const program = await Program.findById(programId);
    if (!program) {
        return next(new ApiError('Program not found', 404));
    }

    // Check if course already exists under this program
    const courseExists = await Course.findOne({ name: formattedCourseName, programId });
    if (courseExists) {
        return next(new ApiError('Course already exists in this program', 409));
    }

    // Create new course
    const course = await Course.create({ name: formattedCourseName, programId });

    res.status(201).json({
        status: 'success',
        data: course
    });
});

exports.getAllCoursesByProgram = catchAsync(async (req, res, next) => {
    const { programId } = req.params;

    if (!programId) {
        return next(new ApiError('Program ID is required', 400));
    }

    // Check if program exists
    const program = await Program.findById(programId);
    if (!program) {
        return next(new ApiError('Program not found', 404));
    }

    // Find courses under this program
    const courses = await Course.find({ programId }).select('_id name');

    res.status(200).json({
        status: 'success',
        results: courses.length,
        data: courses
    });
});
