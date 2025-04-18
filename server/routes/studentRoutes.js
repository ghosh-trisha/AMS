const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController/studentController');
const attendanceController = require('../controllers/attendanceController');


// get todays classes as a student
router.get('/classes/:studentId/:givenSessionId', studentController.getTodaysClassesAsStudent);


// create attendance request as a student
router.post('/attendance', attendanceController.createAttendanceRequestAsStudent);


// get attendance status as a student
router.get('/attendance/status/:studentId/:sessionId/:scheduleId/:subjectId', attendanceController.getAttendanceStatusAsStudent);


// get all current sessions of a student
router.get('/sessions/:studentId', studentController.getAllCurrentSessionsOfAStudent);


module.exports = router;
