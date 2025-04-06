const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const Schedule = require('../../models/Schedule');
const ScheduleTeacherMapper = require('../../models/ScheduleTeacherMapper');
const mongoose = require('mongoose');
const Session = require('../../models/Session');
const Subject = require('../../models/Subject');
const Teacher = require('../../models/Teacher');


// Create schedule for a session
exports.createSchedule = catchAsync(async (req, res, next) => {
  const { sessionId, subjectId, schedule } = req.body;

  // Validate request body
  if (!sessionId || !subjectId || !schedule || !Array.isArray(schedule)) {
    return next(new ApiError('sessionId, subjectId, and a schedule array are required', 400));
  }

  // Check if session and subject exist
  const sessionExists = await Session.findById(sessionId);
  const subjectExists = await Subject.findById(subjectId);
  
  if (!sessionExists) return next(new ApiError('Session not found', 404));
  if (!subjectExists) return next(new ApiError('Subject not found', 404));

  let createdSchedules = [];

  // Iterate over each schedule item
  for (const item of schedule) {
    const { day, start_time, end_time, teacherIds } = item;

    // Validate schedule item fields
    if (!day || !start_time || !end_time || !teacherIds || !Array.isArray(teacherIds)) {
      return next(new ApiError('Each schedule item must include day, start_time, end_time, and an array of teacherIds', 400));
    }

    // Check if all teacher IDs are valid
    const teachers = await Teacher.find({ _id: { $in: teacherIds } });
    if (teachers.length !== teacherIds.length) {
      return next(new ApiError('Invalid teacher ID(s) provided', 400));
    }

    // Create a schedule entry
    const newSchedule = await Schedule.create({
      sessionId,
      subjectId,
      day,
      start_time,
      end_time,
    });
    createdSchedules.push(newSchedule);

    // Create mappings between schedule and teachers
    const mapperEntries = teacherIds.map(teacherId => ({
      scheduleId: newSchedule._id,
      teacherId
    }));
    await ScheduleTeacherMapper.insertMany(mapperEntries);
  }

  res.status(201).json({
    status: 'success',
    message: 'Schedules created successfully',
    data: createdSchedules,
  });
});



// Get all schedules for a session
exports.getAllSchedulesBySession = catchAsync(async (req, res, next) => {
  const { sessionId } = req.params;

  if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
    return next(new ApiError('Invalid or missing Session ID', 400));
  }

  const sessionExists = await Session.findById(sessionId);
  if (!sessionExists) {
    return next(new ApiError('Session not found', 404));
  }

  const schedules = await Schedule.find({ sessionId })
    .populate({
      path: 'subjectId',
      select: 'name code categoryId',
      populate: {
        path: 'categoryId',
        select: 'name'
      }
    })
    .select('-createdAt -updatedAt -__v');

  if (!schedules.length) {
    return next(new ApiError('No schedules found for the given Session ID', 404));
  }

  const scheduleIds = schedules.map(schedule => schedule._id);
  const teacherMappings = await ScheduleTeacherMapper.find({ scheduleId: { $in: scheduleIds } })
    .populate('teacherId', 'name email phone');

  // Combine data
  const scheduleWithTeachers = schedules.map(schedule => {
    const assignedTeachers = teacherMappings
      .filter(mapping => String(mapping.scheduleId) === String(schedule._id))
      .map(mapping => ({
        name: mapping.teacherId.name,
        email: mapping.teacherId.email,
        phone: mapping.teacherId.phone
      }));

    return {
      scheduleId: schedule._id,
      day: schedule.day,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      subject: {
        name: schedule.subjectId?.name,
        code: schedule.subjectId?.code,
        category: schedule.subjectId?.categoryId?.name || 'Unknown',
      },
      teachers: assignedTeachers.length > 0 ? assignedTeachers : ['No teacher assigned'],
    };
  });

  res.status(200).json({
    status: 'success',
    results: scheduleWithTeachers.length,
    data: scheduleWithTeachers,
  });
});
