const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const Schedule = require('../../models/Schedule');

// Create schedule for a session
exports.createSchedule = catchAsync(async (req, res, next) => {
  const { sessionId, subjectId, schedule } = req.body;

  // Validate request body
  if (!sessionId || !subjectId || !schedule || !Array.isArray(schedule)) {
    return next(new ApiError('sessionId, subjectId, and a schedule array are required', 400));
  }

  let createdSchedules = [];

  // Iterate over each schedule item
  for (const item of schedule) {
    const { day, start_time, end_time, teacherIds } = item;

    // Validate schedule item fields
    if (!day || !start_time || !end_time || !teacherIds || !Array.isArray(teacherIds)) {
      return next(
        new ApiError('Each schedule item must include day, start_time, end_time, and an array of teacherIds', 400)
      );
    }

    // For each teacher, create a Schedule document
    for (const teacherId of teacherIds) {
      const schedule = await Schedule.create({
        sessionId,
        subjectId,
        day,
        start_time,
        end_time,
        teacherId,
      });
      createdSchedules.push(schedule);
    }
  }

  res.status(201).json({
    status: 'success',
    data: createdSchedules,
  });
});


exports.getAllSchedulesBySession = catchAsync(async (req, res, next) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return next(new ApiError('Session ID is required', 400));
  }

  // Retrieve schedules for the given sessionId, with optional population of teacher and subject details.
  const schedules = await Schedule.find({ sessionId })
    .populate('teacherId', 'name')
    .populate('subjectId', 'name')
    .select('-createdAt -updatedAt -__v');

  res.status(200).json({
    status: 'success',
    results: schedules.length,
    data: schedules
  });
});
