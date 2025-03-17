const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController/studentController');


// get todays classes as a student
router.get('/classes/:studentId', studentController.getTodaysClassesAsStudent);


module.exports = router;
