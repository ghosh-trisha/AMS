const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const Program = require('../../models/Program');
const Level = require('../../models/Level');

exports.createProgram = catchAsync(async (req, res, next) => {
    const { name, levelId } = req.body;

    if (!name || !levelId) {
        return next(new ApiError('Program name and Level ID are required', 400));
    }

    // Normalize program name (trim, lowercase, and replace multiple spaces with a single space)
    const formattedProgramName = name.trim().toLowerCase().replace(/\s+/g, ' ');

    // Check if level exists
    const level = await Level.findById(levelId);
    if (!level) {
        return next(new ApiError('Level not found', 404));
    }

    // Check if program already exists under this level
    const programExists = await Program.findOne({ name: formattedProgramName, levelId });
    if (programExists) {
        return next(new ApiError('Program already exists in this level', 409));
    }

    // Create new program
    const program = await Program.create({ name: formattedProgramName, levelId });

    res.status(201).json({
        status: 'success',
        data: program
    });
});

exports.getAllProgramsByLevel = catchAsync(async (req, res, next) => {
    const { levelId } = req.params;

    if (!levelId) {
        return next(new ApiError('Level ID is required', 400));
    }

    // Check if level exists
    const level = await Level.findById(levelId);
    if (!level) {
        return next(new ApiError('Level not found', 404));
    }

    // Find programs under this level
    const programs = await Program.find({ levelId }).select('_id name');

    res.status(200).json({
        status: 'success',
        results: programs.length,
        data: programs
    });
});
