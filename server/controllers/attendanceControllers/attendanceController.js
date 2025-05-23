const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const Attendance = require('../../models/Attendance');
const Student = require('../../models/Student');
const Session = require('../../models/Session');
const Schedule = require('../../models/Schedule');
const Subject = require('../../models/Subject');
const mongoose = require('mongoose');
const Teacher = require('../../models/Teacher');
const ClassAttendance = require('../../models/ClassAttendance');


// Start a particular today's class attendance as a teacher
exports.startClassAttendence = catchAsync(async (req, res, next) => {
    const { startedBy, subjectId, scheduleId, sessionId } = req.body;

    if (!startedBy || !subjectId || !scheduleId || !sessionId) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const existing = await ClassAttendance.findOne({
        startedBy,
        subjectId,
        scheduleId,
        sessionId,
        date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existing) {
        return res.status(409).json({
            message: "Class attendance has already been started for this schedule today.",
            data: existing
        });
    }

    const newClassAttendance = await ClassAttendance.create({
        startedBy,
        subjectId,
        scheduleId,
        sessionId,
        date: new Date(new Date().setHours(0, 0, 0, 0))
    });

    return res.status(201).json({
        message: "Class attendance started successfully.",
        data: newClassAttendance,
    });
})


// create attendance request as a student
exports.createAttendanceRequestAsStudent = catchAsync(async (req, res, next) => {
    const { studentId, sessionId, scheduleId, subjectId, classAttendanceId } = req.body;

    // Validate input
    if (!studentId || !sessionId || !scheduleId || !subjectId || !classAttendanceId) {
        return next(new ApiError('All fields are required', 400));
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
        return next(new ApiError('Student not found', 404));
    }

    // Check if session exists
    const session = await Session.findById(sessionId);
    if (!session) {
        return next(new ApiError('Session not found', 404));
    }

    // Check if schedule exists
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
        return next(new ApiError('Schedule not found', 404));
    }

    // Check if subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
        return next(new ApiError('Subject not found', 404));
    }

    // Check if classAttendanceId exists
    const classAttendance = await ClassAttendance.findById(classAttendanceId);
    if (!classAttendance) {
        return next(new ApiError('Class is not started yet', 404));
    }

    // Create attendance request
    const newAttendance = await Attendance.create({
        studentId,
        status: 'pending',
        sessionId,
        scheduleId,
        subjectId,
        classDate: new Date(new Date().setHours(0, 0, 0, 0)),
        classAttendanceId
    });

    res.status(201).json({
        status: 'success',
        data: newAttendance
    });
});


// get attendance requests as a teacher
exports.getAttendanceRequestsAsTeacher = catchAsync(async (req, res, next) => {
    const { scheduleId } = req.params;

    // Validate the input fields
    if (!scheduleId) {
        return next(new ApiError('scheduleId is required', 400));
    }

    // Validate if ObjectIds are correct
    if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
        return next(new ApiError('Invalid IDs provided', 400));
    }

    // Check if session, schedule, and subject exist
    const scheduleExists = await Schedule.findById(scheduleId);

    if (!scheduleExists) {
        return next(new ApiError('Schedule not found', 404));
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Find attendance requests
    const attendanceRequests = await Attendance.find({
        scheduleId,
        classDate: { $gte: startOfDay, $lte: endOfDay },

    })
        .populate('studentId', 'name phone rollNumber')
        .select('-createdAt -updatedAt -__v -sessionId -scheduleId -subjectId -classDate');

    // if (attendanceRequests.length === 0) {
    //     return next(new ApiError('No attendance requests found for today for this class', 404));
    // }

    res.status(200).json({
        status: 'success',
        results: attendanceRequests.length,
        data: attendanceRequests
    });
});


// give attendance accepted or rejected status as a teacher
exports.updateAttendanceStatusAsTeacher = catchAsync(async (req, res, next) => {
    const { attendanceId, status, teacherId } = req.body;

    // Validate request body
    if (!attendanceId || !status || !teacherId) {
        return next(new ApiError('AttendanceId, status, and teacherId are required', 400));
    }

    if (!['accepted', 'rejected'].includes(status)) {
        return next(new ApiError('Invalid status. Must be "accepted" or "rejected"', 400));
    }

    // Check if attendance exists
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
        return next(new ApiError('Attendance request not found', 404));
    }

    // Check if teacher exists
    const teacherExists = await Teacher.findById(teacherId);
    if (!teacherExists) {
        return next(new ApiError('Teacher not found', 404));
    }

    // Update attendance status
    attendance.status = status;
    attendance.acceptedBy = teacherId;
    await attendance.save();

    res.status(200).json({
        status: 'success',
        message: `Attendance status updated to ${status}`,
        data: attendance,
    });
});


// get attendance status as a student
exports.getAttendanceStatusAsStudent = catchAsync(async (req, res, next) => {
    const { studentId, sessionId, scheduleId, subjectId } = req.params;

    // Validate params
    if (!studentId || !scheduleId || !sessionId || !subjectId) {
        return next(new ApiError('studentId, scheduleId, sessionId, and subjectId are required', 400));
    }

    // Check if the attendance record exists for today's date
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const attendance = await Attendance.findOne({
        studentId,
        scheduleId,
        sessionId,
        subjectId,
        classDate: { $gte: startOfDay, $lte: endOfDay }
    })
        .populate('acceptedBy', 'name email phone')
        .populate({
            path: 'subjectId',
            select: 'name code categoryId',
            populate: {
                path: 'categoryId',
                select: 'name'
            }
        });

    if (!attendance) {
        return next(new ApiError('No attendance record found for today', 404));
    }

    // Response
    res.status(200).json({
        status: 'success',
        data: {
            status: attendance.status,
            acceptedBy: attendance.acceptedBy || 'Not yet accepted',
            subject: {
                name: attendance.subjectId?.name,
                code: attendance.subjectId?.code,
                category: attendance.subjectId?.categoryId?.name || 'Unknown'
            }
        },
    });
});
