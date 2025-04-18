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


// get all available teachers
const isOverlapping = (startA, endA, startB, endB) => {
  return (startA < endB && startB < endA);
};
exports.getAllAvailableTeachers = catchAsync(async (req, res, next) => {
  const { day, startTime, endTime } = req.body;
  // console.log(day)
  // console.log(formatTime(startTime))
  // console.log(formatTime(endTime))

  if (!startTime || !endTime || !day) {
    return next(new ApiError('startTime, endTime and day are required', 400));
  }

  // Step 1: Find schedules that overlap with the provided time and day
  const allSchedules = await Schedule.find({ day });
  const overlappingSchedules = allSchedules.filter(schedule =>
    isOverlapping(startTime, endTime, schedule.start_time, schedule.end_time)
  );
  // console.log(overlappingSchedules)

  const overlappingScheduleIds = overlappingSchedules.map(s => s._id);

  // Step 2: Get teacher mappings for overlapping schedule IDs
  const conflictingMappings = await ScheduleTeacherMapper.find({
    scheduleId: { $in: overlappingScheduleIds }
  });

  const conflictingTeacherIds = conflictingMappings.map(m => m.teacherId.toString());

  // Step 3: Get all teachers
  const allTeachers = await Teacher.find();

  // Step 4: Filter out conflicting teachers
  const availableTeachers = allTeachers.filter(teacher =>
    !conflictingTeacherIds.includes(teacher._id.toString())
  );

  res.status(200).json({
    status: 'success',
    results: availableTeachers.length,
    data: availableTeachers
  });
});


// get todays classes as a teacher
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
  const scheduleIds = mappedSchedules.map((map) => map?.scheduleId?._id).filter((ele) => ele != null);

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
        startTime: '$start_time',
        endTime: '$end_time',
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


// Get all weekly schedules for a teacher
exports.getAllWeekScheduleAsTeacher = catchAsync(async (req, res, next) => {
  const { teacherId } = req.params;

  if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
    return next(new ApiError('Invalid or missing Teacher ID', 400));
  }

  const teacherExists = await Teacher.findById(teacherId);
  if (!teacherExists) {
    return next(new ApiError('Teacher not found', 404));
  }

  const schedules = await ScheduleTeacherMapper.aggregate([
    {
      $match: { teacherId: new mongoose.Types.ObjectId(teacherId) }
    },
    {
      $lookup: {
        from: 'schedules',
        localField: 'scheduleId',
        foreignField: '_id',
        as: 'scheduleDetails'
      }
    },
    { $unwind: '$scheduleDetails' },
    {
      $lookup: {
        from: 'subjects',
        localField: 'scheduleDetails.subjectId',
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
    {
      $lookup: {
        from: 'rooms',
        localField: 'scheduleDetails.roomId',
        foreignField: '_id',
        as: 'room'
      }
    },
    { $unwind: '$room' },
    {
      $lookup: {
        from: 'sessions',
        localField: 'scheduleDetails.sessionId',
        foreignField: '_id',
        as: 'session'
      }
    },
    { $unwind: '$session' },
    {
      $lookup: {
        from: 'syllabuses',
        localField: 'session.syllabusId',
        foreignField: '_id',
        as: 'syllabus'
      }
    },
    { $unwind: '$syllabus' },
    {
      $lookup: {
        from: 'semesters',
        localField: 'session.semesterId',
        foreignField: '_id',
        as: 'semester'
      }
    },
    { $unwind: '$semester' },
    {
      $lookup: {
        from: 'courses',
        localField: 'semester.courseId',
        foreignField: '_id',
        as: 'course'
      }
    },
    { $unwind: '$course' },
    {
      $lookup: {
        from: 'programs',
        localField: 'course.programId',
        foreignField: '_id',
        as: 'program'
      }
    },
    { $unwind: '$program' },
    {
      $lookup: {
        from: 'levels',
        localField: 'program.levelId',
        foreignField: '_id',
        as: 'level'
      }
    },
    { $unwind: '$level' },
    {
      $lookup: {
        from: 'departments',
        localField: 'level.departmentId',
        foreignField: '_id',
        as: 'department'
      }
    },
    { $unwind: '$department' },
    {
      $group: {
        _id: '$scheduleId',
        id: { $first: '$scheduleId' },
        day: { $first: '$scheduleDetails.day' },
        start_time: { $first: '$scheduleDetails.start_time' },
        end_time: { $first: '$scheduleDetails.end_time' },
        subjectName: { $first: '$subject.name' },
        subjectCode: { $first: '$subject.code' },
        subjectCategory: { $first: '$subjectCategory.name' },
        roomName: { $first: '$room.name' },
        buildingName: { $first: '$room.buildingName' },
        session: { $first: '$session.academicYear' },
        syllabusName: { $first: '$syllabus.name' },
        semesterName: { $first: '$semester.name' },
        courseName: { $first: '$course.name' },
        programName: { $first: '$program.name' },
        levelName: { $first: '$level.name' },
        departmentName: { $first: '$department.name' }
      }
    },
    {
      $sort: {
        'day': 1,
        'start_time': 1
      }
    },
    {
      $group: {
        _id: '$day',
        schedules: {
          $push: {
            id: '$id',
            day: '$day',
            start_time: '$start_time',
            end_time: '$end_time',
            subjectName: '$subjectName',
            subjectCode: '$subjectCode',
            subjectCategory: '$subjectCategory',
            roomName: '$roomName',
            buildingName: '$buildingName',
            session: '$session',
            syllabusName: '$syllabusName',
            semesterName: '$semesterName',
            courseName: '$courseName',
            programName: '$programName',
            levelName: '$levelName',
            departmentName: '$departmentName'
          }
        }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: schedules.length,
    data: schedules,
  });
});

