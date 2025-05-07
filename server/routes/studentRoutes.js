const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController/studentController');
const attendanceController = require('../controllers/attendanceControllers/attendanceController');
const attendanceReportController = require('../controllers/attendanceControllers/attendanceReportController');


// get todays classes as a student
router.get('/classes/:studentId/:givenSessionId', studentController.getTodaysClassesAsStudent);


// create attendance request as a student
router.post('/attendance', attendanceController.createAttendanceRequestAsStudent);


// get attendance status as a student
router.get('/attendance/status/:studentId/:sessionId/:scheduleId/:subjectId', attendanceController.getAttendanceStatusAsStudent);


// get all current sessions of a student
router.get('/sessions/:studentId', studentController.getAllCurrentSessionsOfAStudent);





//! attendance report routes
// get total attendance of a student
router.get('/attendance/total/:studentId/:sessionId', attendanceReportController.getTotalAttendanceOfAStudent);


// get attendance per subject wise of a student
router.get('/attendance/subject/:studentId/:sessionId', attendanceReportController.getAttendancePerSubjectWiseOfAStudent);


// get detailed attendance report of a student
router.get('/attendance/details/:studentId/:sessionId', attendanceReportController.getDetailedAttendanceReportOfAStudent);


module.exports = router;
