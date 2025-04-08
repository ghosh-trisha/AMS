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

    // ✅ Check for time conflicts
    const existingSchedules = await Schedule.find({ sessionId, day });

    const hasConflict = existingSchedules.some(existing => {
      // Convert to Date objects for comparison
      const newStart = new Date(`1970-01-01T${start_time}`);
      const newEnd = new Date(`1970-01-01T${end_time}`);
      const existingStart = new Date(`1970-01-01T${existing.start_time}`);
      const existingEnd = new Date(`1970-01-01T${existing.end_time}`);

      // 🔁 Check if new schedule overlaps with any existing one
      return (newStart < existingEnd && newEnd > existingStart);
    });

    if (hasConflict) {
      return next(
        new ApiError(
          `Schedule conflict detected: another class is already scheduled for session '${sessionId}' on ${day} during ${start_time} - ${end_time}`,
          400
        )
      );
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
  const schedules = await ScheduleTeacherMapper.aggregate([
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
      $match: {
        'scheduleDetails.sessionId': new mongoose.Types.ObjectId(sessionId),

      }
    },
    {
      $lookup: {
        from: 'teachers',
        localField: 'teacherId',
        foreignField: '_id',
        as: 'teacherDetails'
      }
    },
    { $unwind: '$teacherDetails' },
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
      $group: {
        _id: '$scheduleId',
        id: { $first: '$scheduleId' },
        day: { $first: '$scheduleDetails.day' },
        start_time: { $first: '$scheduleDetails.start_time' },
        end_time: { $first: '$scheduleDetails.end_time' },
        subjectName: { $first: '$subject.name' },
        subjectCode: { $first: '$subject.code' },
        subjectCategory: { $first: '$subjectCategory.name' },
        teachers: {
          $push: {
            name: '$teacherDetails.name',
            email: '$teacherDetails.email',
            phone: '$teacherDetails.phone'
          }
        }
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
            teachers: '$teachers'

          }
        },

      }
    },


  ]);

  res.status(200).json({
    status: 'success',
    results: schedules.length,
    data: schedules,
  });
});



exports.deleteSchedule = catchAsync(async (req, res, next) => {
  const { scheduleId } = req.params;

  await Schedule.findByIdAndDelete(scheduleId)
  res.status(200).json({
    status: 'success',
    message: 'schedule deleted successfuly'
  });
})