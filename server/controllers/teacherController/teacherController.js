const mongoose = require('mongoose');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const Teacher = require('../../models/Teacher');
const Schedule = require('../../models/Schedule');
const ScheduleTeacherMapper = require('../../models/ScheduleTeacherMapper');

// Controller function to get all teachers
exports.getAllTeachers = catchAsync(async (req, res, next) => {
  const teachers = await Teacher.find();

  if (!teachers || teachers.length === 0) {
    return next(new ApiError('Teachers not found', 404));
  }

  res.status(200).json({
    status: 'success',
    totalTeachers: teachers.length,
    data: teachers
  });
});


// exports.getTodaysClassesAsTeacher = catchAsync(async (req, res, next) => {
//   // Retrieve the teacher's ID from the route parameter
//   const { teacherId } = req.params;

//   // Determine today's weekday in long format (e.g., "Monday")
//   const today = new Date();
//   const weekday = today.toLocaleString('en-US', { weekday: 'long' });

//   // Use an aggregation pipeline to gather all required information
//   const classes = await Schedule.aggregate([
//     {
//       $match: {
//         teacherId: new mongoose.Types.ObjectId(teacherId),
//         day: weekday
//       }
//     },
//     // Lookup subject details and join category details for subject category
//     {
//       $lookup: {
//         from: 'subjects',
//         localField: 'subjectId',
//         foreignField: '_id',
//         as: 'subject'
//       }
//     },
//     { $unwind: '$subject' },
//     {
//       $lookup: {
//         from: 'categories',
//         localField: 'subject.categoryId',
//         foreignField: '_id',
//         as: 'subjectCategory'
//       }
//     },
//     { $unwind: '$subjectCategory' },
//     // Lookup session to get academicYear
//     {
//       $lookup: {
//         from: 'sessions',
//         localField: 'sessionId',
//         foreignField: '_id',
//         as: 'session'
//       }
//     },
//     { $unwind: '$session' },
//     // Lookup semester from the session
//     {
//       $lookup: {
//         from: 'semesters',
//         localField: 'session.semesterId',
//         foreignField: '_id',
//         as: 'semester'
//       }
//     },
//     { $unwind: '$semester' },
//     // Lookup course from the semester
//     {
//       $lookup: {
//         from: 'courses',
//         localField: 'semester.courseId',
//         foreignField: '_id',
//         as: 'course'
//       }
//     },
//     { $unwind: '$course' },
//     // Lookup program from the course
//     {
//       $lookup: {
//         from: 'programs',
//         localField: 'course.programId',
//         foreignField: '_id',
//         as: 'program'
//       }
//     },
//     { $unwind: '$program' },
//     // Lookup level from the program
//     {
//       $lookup: {
//         from: 'levels',
//         localField: 'program.levelId',
//         foreignField: '_id',
//         as: 'level'
//       }
//     },
//     { $unwind: '$level' },
//     // Lookup department from the level
//     {
//       $lookup: {
//         from: 'departments',
//         localField: 'level.departmentId',
//         foreignField: '_id',
//         as: 'department'
//       }
//     },
//     { $unwind: '$department' },
//     // Project the required fields
//     {
//       $project: {
//         _id: 0,
//         day: 1,
//         start_time: 1,
//         end_time: 1,
//         subjectName: '$subject.name',
//         subjectCode: '$subject.code',
//         subjectCategory: '$subjectCategory.name',
//         academicYear: '$session.academicYear',
//         semesterName: '$semester.name',
//         courseName: '$course.name',
//         programName: '$program.name',
//         levelName: '$level.name',
//         departmentName: '$department.name'
//       }
//     }
//   ]);

//   res.status(200).json({
//     status: 'success',
//     results: classes.length,
//     data: classes
//   });
// });

exports.getTodaysClassesAsTeacher = catchAsync(async (req, res, next) => {
  const { teacherId } = req.params;

  if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
    return next(new ApiError('Invalid or missing Teacher ID', 400));
  }

  const teacherExists = await Teacher.findById(teacherId);
  if (!teacherExists) {
    return next(new ApiError('Teacher not found', 404));
  }

  // Determine today's weekday
  const today = new Date();
  const weekday = today.toLocaleString('en-US', { weekday: 'long' });

  // First, find schedules for the given teacher using the ScheduleTeacherMapper
  const mappedSchedules = await ScheduleTeacherMapper.find({ teacherId })
    .populate('scheduleId');

  // if (!mappedSchedules.length) {
  //   return next(new ApiError('No classes found for this teacher', 404));
  // }
console.log(mappedSchedules)
  const scheduleIds = mappedSchedules.map((map) => map?.scheduleId?._id).filter((ele)=>ele!=null);

  // Use aggregation pipeline to fetch class details for the schedule IDs
  const classes = await Schedule.aggregate([
    {
      $match: {
        _id: { $in: scheduleIds },
        day: weekday
      }
    },
    // Lookup subject and category details
    {
      $lookup: {
        from: 'subjects',
        localField: 'subjectId',
        foreignField: '_id',
        as: 'subject'
      }
    },
    { $unwind: '$subject' },
    {
      $lookup: {
        from: 'categories',
        localField: 'subject.categoryId',
        foreignField: '_id',
        as: 'subjectCategory'
      }
    },
    { $unwind: '$subjectCategory' },
    // Lookup session
    {
      $lookup: {
        from: 'sessions',
        localField: 'sessionId',
        foreignField: '_id',
        as: 'session'
      }
    },
    { $unwind: '$session' },
    // Lookup semester
    {
      $lookup: {
        from: 'semesters',
        localField: 'session.semesterId',
        foreignField: '_id',
        as: 'semester'
      }
    },
    { $unwind: '$semester' },
    // Lookup course
    {
      $lookup: {
        from: 'courses',
        localField: 'semester.courseId',
        foreignField: '_id',
        as: 'course'
      }
    },
    { $unwind: '$course' },
    // Lookup program
    {
      $lookup: {
        from: 'programs',
        localField: 'course.programId',
        foreignField: '_id',
        as: 'program'
      }
    },
    { $unwind: '$program' },
    // Lookup level
    {
      $lookup: {
        from: 'levels',
        localField: 'program.levelId',
        foreignField: '_id',
        as: 'level'
      }
    },
    { $unwind: '$level' },
    // Lookup department
    {
      $lookup: {
        from: 'departments',
        localField: 'level.departmentId',
        foreignField: '_id',
        as: 'department'
      }
    },
    { $unwind: '$department' },
    // Project the required fields
    {
      $project: {
        _id: 0,
        day: 1,
        start_time: 1,
        end_time: 1,
        subjectName: '$subject.name',
        subjectCode: '$subject.code',
        subjectCategory: '$subjectCategory.name',
        academicYear: '$session.academicYear',
        semesterName: '$semester.name',
        courseName: '$course.name',
        programName: '$program.name',
        levelName: '$level.name',
        departmentName: '$department.name',
        classId: '$_id',
      }
    }
  ]);

  // if (!classes.length) {
  //   return next(new ApiError('No classes found for today', 404));
  // }

  res.status(200).json({
    status: 'success',
    results: classes.length,
    data: classes
  });
});
