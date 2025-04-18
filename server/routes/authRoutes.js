const express = require('express');
const router = express.Router();
const studentAuthController = require('../controllers/authController/studentAuthController');
const teacherAuthController = require('../controllers/authController/teacherAuthController');


// student registration
router.post('/student/register', studentAuthController.registerStudent);
// student login
router.post('/student/login', studentAuthController.loginStudent);
// student logout
router.get('/student/logout', studentAuthController.logoutStudent);
// get student new access token using refresh token
router.get('/student/generateNewAccessToken', studentAuthController.generateNewAccessTokenStudent);
// get student info
router.get('/student/getInfo', studentAuthController.getStudentInfo);
// get student info per session
router.get('/student/getInfo/:sessionId', studentAuthController.getStudentInfoPerSession);


// teacher registration
router.post('/teacher/register', teacherAuthController.registerTeacher);
// teacher login
router.post('/teacher/login', teacherAuthController.loginTeacher);
// teacher logout
router.get('/teacher/logout', teacherAuthController.logoutTeacher);
// get teacher new access token using refresh token
router.get('/teacher/generateNewAccessToken', teacherAuthController.generateNewAccessTokenTeacher);
// get teacher info
router.get('/teacher/getInfo', teacherAuthController.getTeacherInfo);


module.exports = router;
