const express = require('express');
const departmentController = require('../controllers/adminControllers/departmentController');
const levelController = require('../controllers/adminControllers/levelController');
const programController = require('../controllers/adminControllers/programController');
const courseController = require('../controllers/adminControllers/courseController');
const semesterController = require('../controllers/adminControllers/semesterController');
const categoryController = require('../controllers/adminControllers/categoryController');
const syllabusController = require('../controllers/adminControllers/syllabusController');
const sessionController = require('../controllers/adminControllers/sessionController');
const teacherController =require('../controllers/teacherController/teacherController');
const studentController =require('../controllers/studentController/studentController');
const scheduleController = require('../controllers/adminControllers/scheduleController');
const router = express.Router();


// test routes
router.get('/test', (req,res)=>{
    console.log("test")
    res.status(200).json({msg: "test route"})
});


// Department routes
router.post('/departments', departmentController.createDepartment);
router.get('/departments', departmentController.getAllDepartments);


// Level routes
router.post('/levels', levelController.createLevel);
router.get('/levels/:departmentId', levelController.getAllLevelsByDepartment);


// Program routes
router.post('/programs', programController.createProgram);
router.get('/programs/:levelId', programController.getAllProgramsByLevel);


// Course routes
router.post('/courses', courseController.createCourse);
router.get('/courses/:programId', courseController.getAllCoursesByProgram);


// Semester routes
router.post('/semesters', semesterController.createSemester);
router.get('/semesters/:courseId', semesterController.getAllSemestersByCourse);
router.get('/semesters/d/:semesterId', semesterController.getSemesterData);


// Category routes
router.post('/categories', categoryController.createCategory);
router.get('/categories', categoryController.getAllCategories);


// Syllabus routes
router.post('/syllabus', syllabusController.createSyllabus);
router.get('/syllabus/:semesterId', syllabusController.getAllSyllabusBySemester);
router.get('/syllabus/subjects/:sessionId', syllabusController.getAllSyllabusBySession);


// Session routes
router.post('/sessions', sessionController.createSession);
router.get('/sessions/:semesterId', sessionController.getAllSessionsBySemester);


// schedule routes
router.post('/schedule', scheduleController.createSchedule);
router.get('/schedule/:sessionId', scheduleController.getAllSchedulesBySession);


//teacher routes
router.get('/teachers/all',teacherController.getAllTeachers );


// student routes
router.get('/students/all',studentController.getAllStudents );


module.exports = router;
