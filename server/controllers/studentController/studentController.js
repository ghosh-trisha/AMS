const mongoose = require('mongoose');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const Student = require('../../models/Student');
const Schedule = require('../../models/Schedule');
const ScheduleTeacherMapper = require('../../models/ScheduleTeacherMapper');


// Controller function to get all students
exports.getAllStudents = catchAsync(async (req, res, next) => {
    const students = await Student.find();
    const totalStudents = await Student.countDocuments();

    if (!students || students.length === 0) {
        return next(new ApiError('Students not found', 404));
    }

    res.status(200).json({
        status: 'success',
        totalStudents,
        data: {
            students
        }
    });
});


// get today's classes as a student
exports.getTodaysClassesAsStudent = catchAsync(async (req, res, next) => {
    
    const { studentId } = req.params;
    const { givenSessionId } = req.body;
    
    const student = await Student.findById(studentId);
    if (!student) {
        return next(new ApiError('Student not found', 404));
    }
    
    // Determine today's weekday in long format (e.g., "Monday")
    const today = new Date();
    const weekday = today.toLocaleString('en-US', { weekday: 'long' });

    const sessionIdToUse = givenSessionId 
        ? new mongoose.Types.ObjectId(givenSessionId) 
        : student.sessionId[student.sessionId.length - 1];
    // const schedules = await Schedule.aggregate([
    //     {
    //         $match: {
    //             sessionId: sessionIdToUse,
    //             day: weekday
    //         }
    //     },
    //     {
    //         // Added lookup to ScheduleTeacherMapper to get teachers for each schedule
    //         $lookup: {
    //             from: 'scheduleteachermappers',
    //             localField: '_id',
    //             foreignField: 'scheduleId',
    //             as: 'scheduleTeachers'
    //         }
    //     },
    //     { $unwind: '$scheduleTeachers' },
    //     {
    //         // Lookup to fetch teacher details based on teacherId from the mapping
    //         $lookup: {
    //             from: 'teachers',
    //             localField: 'scheduleTeachers.teacherId',
    //             foreignField: '_id',
    //             as: 'teacherDetails'
    //         }
    //     },
    //     { $unwind: '$teacherDetails' },
    //     {
    //         $lookup: {
    //             from: 'subjects',
    //             localField: 'subjectId',
    //             foreignField: '_id',
    //             as: 'subject'
    //         }
    //     },
    //     { $unwind: '$subject' },
    //     {
    //         $lookup: {
    //             from: 'categories',
    //             localField: 'subject.categoryId',
    //             foreignField: '_id',
    //             as: 'subjectCategory'
    //         }
    //     },
    //     { $unwind: '$subjectCategory' },
    //     {
    //         // Group to collect all teachers for a given schedule
    //         $group: {
    //             _id: '$_id',
    //             day: { $first: '$day' },
    //             start_time: { $first: '$start_time' },
    //             end_time: { $first: '$end_time' },
    //             subjectName: { $first: '$subject.name' },
    //             subjectCode: { $first: '$subject.code' },
    //             subjectCategory: { $first: '$subjectCategory.name' },
    //             teachers: {
    //                 $push: {
    //                     name: '$teacherDetails.name',
    //                     email: '$teacherDetails.email',
    //                     phone: '$teacherDetails.phone'
    //                 }
    //             }
    //         }
    //     },
    //     {
    //         $project: {
    //             _id: 0,
    //             day: 1,
    //             start_time: 1,
    //             end_time: 1,
    //             subjectName: 1,
    //             subjectCode: 1,
    //             subjectCategory: 1,
    //             teachers: 1
    //         }
    //     }
    // ]);


    // Aggregate starting from ScheduleTeacherMapper instead of Schedule
    
    const schedules = await ScheduleTeacherMapper.aggregate([
        {
            $lookup: {
                from: 'schedules',
                localField: 'scheduleId',
                foreignField: '_id',
                as: 'scheduleDetails'
            }
        },
        { $unwind: '$scheduleDetails' },
        {
            $match: {
                'scheduleDetails.sessionId': sessionIdToUse,
                'scheduleDetails.day': weekday
            }
        },
        {
            $lookup: {
                from: 'teachers',
                localField: 'teacherId',
                foreignField: '_id',
                as: 'teacherDetails'
            }
        },
        { $unwind: '$teacherDetails' },
        {
            $lookup: {
                from: 'subjects',
                localField: 'scheduleDetails.subjectId',
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
                _id: '$scheduleId',
                day: { $first: '$scheduleDetails.day' },
                start_time: { $first: '$scheduleDetails.start_time' },
                end_time: { $first: '$scheduleDetails.end_time' },
                subjectName: { $first: '$subject.name' },
                subjectCode: { $first: '$subject.code' },
                subjectCategory: { $first: '$subjectCategory.name' },
                teachers: {
                    $push: {
                        name: '$teacherDetails.name',
                        email: '$teacherDetails.email',
                        phone: '$teacherDetails.phone'
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                day: 1,
                start_time: 1,
                end_time: 1,
                subjectName: 1,
                subjectCode: 1,
                subjectCategory: 1,
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
