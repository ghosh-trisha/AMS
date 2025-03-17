const express = require('express');
const teacherController = require('../controllers/teacherController/teacherController');
const router = express.Router();


// get todays classes as a teacher
router.get('/classes/:teacherId', teacherController.getTodaysClassesAsTeacher);


module.exports = router;
