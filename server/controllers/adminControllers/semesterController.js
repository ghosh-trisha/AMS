const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const Semester = require('../../models/Semester');
const Course = require('../../models/Course');
const Program = require('../../models/Program');
const Level = require('../../models/Level');
const Department = require('../../models/Department');

exports.createSemester = catchAsync(async (req, res, next) => {
    const { totalSemesters, courseId } = req.body;

    if (!totalSemesters || !courseId) {
        return next(new ApiError('Total semesters count and Course ID are required', 400));
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
        return next(new ApiError('Course not found', 404));
    }

    // Check existing semesters for this course
    const existingSemesters = await Semester.find({ courseId });

    // Prevent duplicate semester creation if they already exist
    if (existingSemesters.length > 0) {
        return next(new ApiError('Semesters already exist for this course', 409));
    }

    // Create specified number of semesters
    const semesterDocs = [];
    for (let i = 1; i <= totalSemesters; i++) {
        semesterDocs.push({ name: i, courseId });
    }

    // Insert semesters in bulk
    const semesters = await Semester.insertMany(semesterDocs);

    res.status(201).json({
        status: 'success',
        message: `${totalSemesters} semesters created successfully.`,
        data: semesters
    });
});


exports.getAllSemestersByCourse = catchAsync(async (req, res, next) => {
    const { courseId } = req.params;

    if (!courseId) {
        return next(new ApiError('Course ID is required', 400));
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
        return next(new ApiError('Course not found', 404));
    }

    // Find semesters under this course
    const semesters = await Semester.find({ courseId }).select('_id name');

    res.status(200).json({
        status: 'success',
        results: semesters.length,
        data: semesters
    });
});

exports.getSemesterData=catchAsync(async(req,res,next)=>{
    const {semesterId}=req.params;
    if(!semesterId){
        return next(new ApiError('Semester ID is required', 400));
    }
    const semester=await Semester.findById(semesterId);
    if(!semester){
        return next(new ApiError('Semester not found', 404));
    }
    const course=await Course.findById(semester.courseId);
    if(!course){
        return next(new ApiError('Course not found', 404));
    }
    const program=await Program.findById(course.programId);
    if(!program){
        return next(new ApiError('Program not found', 404));
    }
    const level=await Level.findById(program.levelId);
    if(!level){
        return next(new ApiError('Level not found', 404));
    }
    const department=await Department.findById(level.departmentId);
    if(!department){
        return next(new ApiError('Department not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
           "semester":{
            id:semester._id,
            name: semester.name
        },
           "course":{
            id:course._id,
            name: course.name
           } ,
            "program": {
                id: program._id,
                name: program.name
            },
            level: {
                id: level._id,
                name: level.name
            },
            department: {
                id: department._id,
                name: department.name
            }
           
        }
    });
}
)