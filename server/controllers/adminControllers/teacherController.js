const Teacher = require('../../models/Teacher');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');

// Controller function to get all teachers
exports.getAllTeachers =catchAsync( async (req, res, next) => {

        const teachers = await Teacher.find();
        if(!teachers)
            {
                return next(new ApiError('Teachers not found', 404));}
        res.status(200).json({
            status: 'success',
            data: 
                teachers
        
        });
   
})
