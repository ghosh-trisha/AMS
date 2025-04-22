const mongoose = require('mongoose');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const ScheduleTeacherMapper = require('../../models/ScheduleTeacherMapper');
const Attendance = require('../../models/Attendance');
const Student = require('../../models/Student');
const StudentMaster = require('../../models/StudentMaster');
const Department = require('../../models/Department');
const Level = require('../../models/Level');
const Program = require('../../models/Program');
const Course = require('../../models/Course');
const Semester = require('../../models/Semester');
const Session = require('../../models/Session');


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

    const { studentId, givenSessionId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
        return next(new ApiError('Student not found', 404));
    }

    // Determine today's weekday in long format (e.g., "Monday")
    const today = new Date();
    const weekday = today.toLocaleString('en-US', { weekday: 'long' });
    // const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

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
                },
                scheduleId: { $first: '$scheduleDetails._id' },
                subjectId: { $first: '$subject._id' },
                sessionId: { $first: '$scheduleDetails.sessionId' },
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
                teachers: 1,
                scheduleId: 1,
                subjectId: 1,
                sessionId: 1
            }
        }
    ]);

    for (const schedule of schedules) {
        const attendance = await Attendance.findOne({
            studentId: studentId,
            sessionId: sessionIdToUse,
            scheduleId: schedule.scheduleId,
            subjectId: schedule.subjectId,
            classDate: { $gte: startOfDay, $lte: endOfDay }
        });
        // console.log(attendance)

        schedule.attendanceStatus = attendance ? attendance.status : null;
    }

    res.status(200).json({
        status: 'success',
        results: schedules.length,
        data: schedules
    });
});


// get all current sessions of a student
exports.getAllCurrentSessionsOfAStudent = catchAsync(async (req, res, next) => {
    const { studentId } = req.params;

    const student = await Student.findById(studentId).populate({
        path: 'sessionId',
        select: 'academicYear syllabusId semesterId'
    });

    if (!student) {
        return next(new ApiError('Student not found', 404));
    }

    res.status(200).json({
        status: 'success',
        totalCurrentSessions: student.sessionId.length,
        data: {
            currentSessions: student.sessionId
        }
    });
});


// get all students' verify status
// exports.getAllStudentsVerifyStatus = catchAsync(async (req, res, next) => {
//     try {
//         const groupedMasters = await StudentMaster.aggregate([
//             {
//                 $group: {
//                     _id: {
//                         studentId: "$studentId",
//                         departmentId: "$departmentId",
//                         levelId: "$levelId",
//                         programId: "$programId",
//                         courseId: "$courseId",
//                         semesterId: "$semesterId",
//                         sessionId: "$sessionId"
//                     }
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "students",
//                     localField: "_id.studentId",
//                     foreignField: "_id",
//                     as: "student"
//                 }
//             },
//             { $unwind: "$student" },
//             {
//                 $lookup: {
//                     from: "departments",
//                     localField: "_id.departmentId",
//                     foreignField: "_id",
//                     as: "department"
//                 }
//             },
//             { $unwind: "$department" },
//             {
//                 $lookup: {
//                     from: "levels",
//                     localField: "_id.levelId",
//                     foreignField: "_id",
//                     as: "level"
//                 }
//             },
//             { $unwind: "$level" },
//             {
//                 $lookup: {
//                     from: "programs",
//                     localField: "_id.programId",
//                     foreignField: "_id",
//                     as: "program"
//                 }
//             },
//             { $unwind: "$program" },
//             {
//                 $lookup: {
//                     from: "courses",
//                     localField: "_id.courseId",
//                     foreignField: "_id",
//                     as: "course"
//                 }
//             },
//             { $unwind: "$course" },
//             {
//                 $lookup: {
//                     from: "semesters",
//                     localField: "_id.semesterId",
//                     foreignField: "_id",
//                     as: "semester"
//                 }
//             },
//             { $unwind: "$semester" },
//             {
//                 $lookup: {
//                     from: "sessions",
//                     localField: "_id.sessionId",
//                     foreignField: "_id",
//                     as: "session"
//                 }
//             },
//             { $unwind: "$session" },
//             {
//                 $project: {
//                     _id: 0,
//                     studentId: "$_id.studentId",
//                     name: "$student.name",
//                     email: "$student.email",
//                     phone: "$student.phone",
//                     isVerified: "$student.isVerified",
//                     departmentName: "$department.name",
//                     levelName: "$level.name",
//                     programName: "$program.name",
//                     courseName: "$course.name",
//                     semesterName: "$semester.name",
//                     sessionAcademicYear: "$session.academicYear"
//                 }
//             }
//         ]);

//         res.status(200).json({
//             success: true,
//             message: "Student verify status fetched successfully",
//             totalStudents: groupedMasters.length,
//             data: groupedMasters
//         });
//     } catch (error) {
//         console.error("Error fetching grouped student verify status:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// });
exports.getAllStudentsVerifyStatus = catchAsync(async (req, res, next) => {
    try {
        const studentMasters = await StudentMaster.aggregate([
            {
                $lookup: {
                    from: "students",
                    localField: "studentId",
                    foreignField: "_id",
                    as: "student"
                }
            },
            { $unwind: "$student" },
            {
                $lookup: {
                    from: "departments",
                    localField: "departmentId",
                    foreignField: "_id",
                    as: "department"
                }
            },
            { $unwind: "$department" },
            {
                $lookup: {
                    from: "levels",
                    localField: "levelId",
                    foreignField: "_id",
                    as: "level"
                }
            },
            { $unwind: "$level" },
            {
                $lookup: {
                    from: "programs",
                    localField: "programId",
                    foreignField: "_id",
                    as: "program"
                }
            },
            { $unwind: "$program" },
            {
                $lookup: {
                    from: "courses",
                    localField: "courseId",
                    foreignField: "_id",
                    as: "course"
                }
            },
            { $unwind: "$course" },
            {
                $lookup: {
                    from: "semesters",
                    localField: "semesterId",
                    foreignField: "_id",
                    as: "semester"
                }
            },
            { $unwind: "$semester" },
            {
                $lookup: {
                    from: "sessions",
                    localField: "sessionId",
                    foreignField: "_id",
                    as: "session"
                }
            },
            { $unwind: "$session" },
            {
                $project: {
                    departmentName: "$department.name",
                    levelName: "$level.name",
                    programName: "$program.name",
                    courseName: "$course.name",
                    semesterName: "$semester.name",
                    sessionAcademicYear: "$session.academicYear",
                    student: {
                        studentId: "$studentId",
                        name: "$student.name",
                        email: "$student.email",
                        phone: "$student.phone",
                        isVerified: "$student.isVerified"
                    }
                }
            }
        ]);

        const nestedStructure = {};

        for (const entry of studentMasters) {
            const {
                departmentName,
                levelName,
                programName,
                courseName,
                semesterName,
                sessionAcademicYear,
                student
            } = entry;

            if (!nestedStructure[departmentName]) nestedStructure[departmentName] = {};
            if (!nestedStructure[departmentName][levelName]) nestedStructure[departmentName][levelName] = {};
            if (!nestedStructure[departmentName][levelName][programName]) nestedStructure[departmentName][levelName][programName] = {};
            if (!nestedStructure[departmentName][levelName][programName][courseName]) nestedStructure[departmentName][levelName][programName][courseName] = {};
            if (!nestedStructure[departmentName][levelName][programName][courseName][semesterName]) nestedStructure[departmentName][levelName][programName][courseName][semesterName] = {};
            if (!nestedStructure[departmentName][levelName][programName][courseName][semesterName][sessionAcademicYear]) {
                nestedStructure[departmentName][levelName][programName][courseName][semesterName][sessionAcademicYear] = [];
            }

            nestedStructure[departmentName][levelName][programName][courseName][semesterName][sessionAcademicYear].push(student);
        }

        res.status(200).json({
            success: true,
            message: "Nested student verify status fetched successfully",
            data: nestedStructure
        });
    } catch (error) {
        console.error("Error fetching nested student verify status:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});




// update all students' verify status
exports.updateOneStudentsVerifyStatus = catchAsync(async (req, res, next) => {
    const { studentId, isVerified } = req.body;

    if (!studentId || typeof isVerified !== 'boolean') {
        return res.status(400).json({ success: false, message: "Invalid input. Please provide a valid studentId and verification status." });
    }

    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            { isVerified },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.status(200).json({
            success: true,
            message: "Student verification status updated successfully",
            data: updatedStudent
        });

    } catch (error) {
        console.error("Error updating student verification status:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

