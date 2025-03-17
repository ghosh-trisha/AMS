const mongoose = require('mongoose');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const Student = require('../../models/Student');
const Schedule = require('../../models/Schedule');


// Controller function to get all students
exports.getAllStudents = catchAsync(async (req, res, next) => {

    const students = await Student.find();
    if (!students) {
        return next(new ApiError('Students not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            students
        }
    });

})


exports.getTodaysClassesAsStudent = catchAsync(async (req, res, next) => {
    // Retrieve the student's ID from the route parameter
    const { studentId } = req.params;
  
    // Find the student to get the sessionId
    const student = await Student.findById(studentId);
    if (!student) {
      return next(new ApiError('Student not found', 404));
    }
    const { sessionId } = student;
  
    // Determine today's weekday in long format (e.g., "Monday")
    const today = new Date();
    const weekday = today.toLocaleString('en-US', { weekday: 'long' });
  
    // Use an aggregation pipeline to join teacher, subject, and category data
    const schedules = await Schedule.aggregate([
      {
        $match: {
          sessionId: new mongoose.Types.ObjectId(sessionId), // Use new operator here
          day: weekday
        }
      },
      // Lookup teacher to get teacher's name only
      {
        $lookup: {
          from: 'teachers', // Ensure this matches your collection name
          localField: 'teacherId',
          foreignField: '_id',
          as: 'teacher'
        }
      },
      { $unwind: '$teacher' },
      // Lookup subject details (name and code)
      {
        $lookup: {
          from: 'subjects', // Ensure this matches your collection name
          localField: 'subjectId',
          foreignField: '_id',
          as: 'subject'
        }
      },
      { $unwind: '$subject' },
      // Lookup category details for the subject
      {
        $lookup: {
          from: 'categories', // Ensure this matches your collection name
          localField: 'subject.categoryId',
          foreignField: '_id',
          as: 'subjectCategory'
        }
      },
      { $unwind: '$subjectCategory' },
      // Project only the fields we need
      {
        $project: {
          _id: 0,
          day: 1,
          start_time: 1,
          end_time: 1,
          teacherName: '$teacher.name',
          subjectName: '$subject.name',
          subjectCode: '$subject.code',
          subjectCategory: '$subjectCategory.name'
        }
      }
    ]);
  
    res.status(200).json({
      status: 'success',
      results: schedules.length,
      data: schedules
    });
});
