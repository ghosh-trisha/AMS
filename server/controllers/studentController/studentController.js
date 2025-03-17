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
  
    const schedules = await Schedule.aggregate([
      {
          $match: {
              sessionId: new mongoose.Types.ObjectId(sessionId),
              day: weekday
          }
      },
      {
          $lookup: {
              from: 'teachers',
              localField: 'teacherId',
              foreignField: '_id',
              as: 'teacher'
          }
      },
      { $unwind: '$teacher' },
      {
          $lookup: {
              from: 'subjects',
              localField: 'subjectId',
              foreignField: '_id',
              as: 'subject'
          }
      },
      { $unwind: '$subject' },
      {
          $lookup: {
              from: 'categories',
              localField: 'subject.categoryId',
              foreignField: '_id',
              as: 'subjectCategory'
          }
      },
      { $unwind: '$subjectCategory' },
      {
          $group: {
              _id: {
                  day: '$day',
                  start_time: '$start_time',
                  end_time: '$end_time',
                  subjectName: '$subject.name',
                  subjectCode: '$subject.code',
                  subjectCategory: '$subjectCategory.name'
              },
              teachers: { $push: '$teacher.name' } // Collect teacher names as an array
          }
      },
      {
          $project: {
              _id: 0,
              day: '$_id.day',
              start_time: '$_id.start_time',
              end_time: '$_id.end_time',
              subjectName: '$_id.subjectName',
              subjectCode: '$_id.subjectCode',
              subjectCategory: '$_id.subjectCategory',
              teachers: 1
          }
      }
  ]);
  
  
    res.status(200).json({
      status: 'success',
      results: schedules.length,
      data: schedules
    });
});
