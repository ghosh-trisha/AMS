const mongoose = require('mongoose');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const Teacher = require('../../models/Teacher');
const Schedule = require('../../models/Schedule');
const ScheduleTeacherMapper = require('../../models/ScheduleTeacherMapper');
const jwt = require('jsonwebtoken');
const ClassAttendance = require('../../models/ClassAttendance');

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

  if (!startTime || !endTime || !day) {
    return next(new ApiError('startTime, endTime and day are required', 400));
  }

  // Step 1: Find schedules that overlap with the provided time and day
  const allSchedules = await Schedule.find({ day });
  const overlappingSchedules = allSchedules.filter(schedule =>
    isOverlapping(startTime, endTime, schedule.start_time, schedule.end_time)
  );

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
        scheduleId: '$_id',
        subjectId: '$subject._id',
        sessionId: '$session._id',
      }
    }
  ]);

  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  const enrichedClasses = await Promise.all(classes.map(async (cls) => {
    const attendance = await ClassAttendance.findOne({
      subjectId: cls.subjectId,
      sessionId: cls.sessionId,
      scheduleId: cls.scheduleId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    return {
      ...cls,
      classAttendanceId: attendance ? attendance._id : null
    };
  }));

  res.status(200).json({
    status: 'success',
    results: enrichedClasses.length,
    data: enrichedClasses
  });
});


// Get all weekly schedules for a teacher
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
exports.getAllWeekScheduleAsTeacher = catchAsync(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, accessTokenSecret, async (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });

    const teacherId = decoded.id;

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
  })
});


// get all students' verify status
exports.getPendingVerifiedTeachers = catchAsync(async (req, res, next) => {
  const pendingTeachers = await Teacher.find({ verified: 0 })
    .select('name email phone verified');

  res.status(200).json({
    success: true,
    message: 'Pending verification teachers fetched successfully',
    totalTeachers: pendingTeachers.length,
    data: pendingTeachers
  });
});


// update one student verify status
exports.updateOneTeacherVerifyStatus = catchAsync(async (req, res, next) => {
  const { teacherId, verified } = req.body;

  if (!teacherId || typeof verified !== 'number' || ![0, 1, 2].includes(verified)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input. Please provide a valid teacherId and verification status (0, 1, or 2).'
    });
  }

  const updatedTeacher = await Teacher.findByIdAndUpdate(
    teacherId,
    { verified },
    { new: true }
  );

  if (!updatedTeacher) {
    return res.status(404).json({ success: false, message: 'Teacher not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Teacher verification status updated successfully',
    data: updatedTeacher
  });
});