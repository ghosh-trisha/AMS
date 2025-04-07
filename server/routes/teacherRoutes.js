const express = require('express');
const teacherController = require('../controllers/teacherController/teacherController');
const attendanceController = require('../controllers/attendanceController');
const router = express.Router();


// get todays classes as a teacher
router.get('/classes/:teacherId', teacherController.getTodaysClassesAsTeacher);


// get attendance request as a teacher
router.get('/attendance/:scheduleId', attendanceController.getAttendanceRequestsAsTeacher);


// give attendance accepted or rejected status as a teacher
router.post('/attendance/update', attendanceController.updateAttendanceStatusAsTeacher);



module.exports = router;
