const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const Attendance = require('../../models/Attendance');
const Subject = require('../../models/Subject');
const mongoose = require('mongoose');
const ClassAttendance = require('../../models/ClassAttendance');
const Schedule = require('../../models/Schedule');
const Student = require('../../models/Student');
const Session = require('../../models/Session');


// get total attendance of a student
exports.getTotalAttendanceOfAStudent = catchAsync(async (req, res, next) => {
    const { studentId, sessionId } = req.params;

    if (!studentId || !sessionId) {
        return res.status(400).json({ message: 'studentId and sessionId are required' });
    }

    // ✅ Step 0: Get student basic info
    const student = await Student.findById(studentId).select('name rollNumber registrationNumber');
    if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
    }
    const sessionExists = await Session.findById(sessionId);
    if (!sessionExists) {
        return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Get total number of classes conducted for the session
    const totalClasses = await ClassAttendance.countDocuments({ sessionId });

    // Get number of classes attended by the student
    const attendedClasses = await Attendance.countDocuments({
        studentId,
        sessionId,
        status: 'accepted'
    });

    res.status(200).json({
        message: 'Attendance summary fetched successfully',
        studentData: {
            name: student.name,
            rollNumber: student.rollNumber,
            registrationNumber: student.registrationNumber
        },
        data: {
            totalClasses,
            attendedClasses,
            attendancePercentage: totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(2) : '0.00'
        }
    });
})


// get attendance per subject wise of a student
exports.getAttendancePerSubjectWiseOfAStudent = catchAsync(async (req, res, next) => {
    const { studentId, sessionId } = req.params;

    if (!studentId || !sessionId) {
        return res.status(400).json({ message: 'studentId and sessionId are required' });
    }

    // Step 1: Find all subjects the student attended in this session
    const attendedRecords = await Attendance.aggregate([
        {
            $match: {
                studentId: new mongoose.Types.ObjectId(studentId),
                sessionId: new mongoose.Types.ObjectId(sessionId),
                status: 'accepted'
            }
        },
        {
            $group: {
                _id: '$subjectId',
                attendedClasses: { $sum: 1 }
            }
        }
    ]);

    // Step 2: Get total classes conducted per subject for that session
    const totalRecords = await ClassAttendance.aggregate([
        {
            $match: {
                sessionId: sessionId
            }
        },
        {
            $group: {
                _id: '$subjectId',
                totalClasses: { $sum: 1 }
            }
        }
    ]);

    // Step 3: Merge both
    const summary = [];

    for (const total of totalRecords) {
        const attended = attendedRecords.find(a => a._id.toString() === total._id.toString());
        const attendanceCount = attended ? attended.attendedClasses : 0;

        const subject = await Subject.findOne({ _id: total._id }).select('name');

        summary.push({
            subjectId: total._id,
            subjectName: subject ? subject.name : 'Unknown Subject',
            totalClasses: total.totalClasses,
            attendedClasses: attendanceCount,
            attendancePercentage: ((attendanceCount / total.totalClasses) * 100).toFixed(2)
        });
    }

    res.status(200).json({
        message: 'Subject-wise attendance summary fetched successfully',
        data: summary
    });
})


// get detailed attendance report of a student
exports.getDetailedAttendanceReportOfAStudent = catchAsync(async (req, res, next) => {
    const { studentId, sessionId } = req.params;

    if (!studentId || !sessionId) {
        return res.status(400).json({ success: false, message: 'studentId and sessionId are required' });
    }


    // Step 1: Get all class attendance records for this session
    const classAttendances = await ClassAttendance.find({ sessionId })
        .populate({
            path: 'subjectId',
            select: 'name code categoryId',
            populate: { path: 'categoryId', select: 'name' }
        })
        .populate({
            path: 'scheduleId',
            select: 'start_time end_time'
        });

    const report = [];

    // Step 2: For each class, get attendance status
    for (const classEntry of classAttendances) {
        const attendanceRecord = await Attendance.findOne({
            studentId,
            sessionId,
            classAttendanceId: classEntry._id,
            subjectId: classEntry.subjectId._id,
            classDate: classEntry.date
        }).select('status');


        report.push({
            subjectName: classEntry.subjectId.name,
            subjectCode: classEntry.subjectId.code,
            category: classEntry.subjectId.categoryId ? classEntry.subjectId.categoryId.name : 'N/A',
            date: classEntry.date.toLocaleDateString('en-GB'),
            startTime: classEntry.scheduleId?.start_time || 'N/A',
            endTime: classEntry.scheduleId?.end_time || 'N/A',
            status: attendanceRecord ? attendanceRecord.status : 'N/A'
        });
    }

    res.status(200).json({
        success: true,
        message: 'Detailed attendance report fetched successfully',
        data: report
    })
})


// get total attendance of all students in a session
exports.getTotalAttendanceOfAllStudents = catchAsync(async (req, res, next) => {
    const { sessionId } = req.params;
  
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'sessionId is required' });
    }
  
    const sessionObjectId = new mongoose.Types.ObjectId(sessionId);
  
    // Step 1: Get all students linked to this session
    const students = await Student.find({ sessionId }) // adjust if session is nested in another way
      .select('_id name rollNumber registrationNumber');
  
    // Step 2: Get total classes for the session
    const totalClasses = await ClassAttendance.countDocuments({ sessionId: sessionObjectId });
  
    // Step 3: Build attendance summary for each student
    const attendanceReport = await Promise.all(
      students.map(async (student) => {
        const attendedClasses = await Attendance.countDocuments({
          studentId: student._id,
          sessionId: sessionObjectId,
          status: 'accepted'
        });
  
        const percentage =
          totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(2) : '0.00';
  
        return {
          studentId: student._id,
          name: student.name,
          rollNumber: student.rollNumber,
          registrationNumber: student.registrationNumber,
          totalClasses,
          attendedClasses,
          attendancePercentage: percentage
        };
      })
    );
  
    res.status(200).json({
      success: true,
      message: 'Attendance summary of all students fetched successfully',
      data: attendanceReport
    });
  });
  