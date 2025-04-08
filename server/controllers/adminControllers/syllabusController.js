const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const Syllabus = require('../../models/Syllabus');
const Subject = require('../../models/Subject');
const Semester = require('../../models/Semester');
const Session = require('../../models/Session');

exports.createSyllabus = catchAsync(async (req, res, next) => {
    const { name, semesterId, subjects } = req.body;

    if (!name || !semesterId || !Array.isArray(subjects) || subjects.length === 0) {
        return next(new ApiError('Syllabus name, semester ID, and subjects are required', 400));
    }

    // Check if semester exists
    const semester = await Semester.findById(semesterId);
    if (!semester) {
        return next(new ApiError('Semester not found', 404));
    }

    // Create syllabus entry
    const syllabus = await Syllabus.create({ name, semesterId });

    // Create subjects associated with this syllabus
    const subjectData = subjects.map(subject => ({
        name: subject.subjectName,
        code: subject.subjectCode,
        categoryId: subject.subjectCategory,
        syllabusId: syllabus._id
    }));

    const createdSubjects = await Subject.insertMany(subjectData);

    res.status(201).json({
        status: 'success',
        data: {
            syllabus,
            subjects: createdSubjects
        }
    });
});

exports.getAllSyllabusBySemester = catchAsync(async (req, res, next) => {
    const { semesterId } = req.params;

    if (!semesterId) {
        return next(new ApiError('Semester ID is required', 400));
    }

    // Check if the semester exists
    const semester = await Semester.findById(semesterId);
    if (!semester) {
        return next(new ApiError('Semester not found', 404));
    }

    // Find all syllabus entries for this semester
    const syllabusList = await Syllabus.find({ semesterId });

    // Fetch subjects for each syllabus and populate category details
    const syllabusWithSubjects = await Promise.all(
        syllabusList.map(async (syllabus) => {
            const subjects = await Subject.find({ syllabusId: syllabus._id })
                .select('-createdAt -updatedAt -__v')
                .populate({ path: 'categoryId', select: 'name' });

            return {
                _id: syllabus._id,
                name: syllabus.name,
                subjects,
            };
        })
    );

    res.status(200).json({
        status: 'success',
        results: syllabusWithSubjects.length,
        data: syllabusWithSubjects,
    });
})


exports.getAllSyllabusBySession = catchAsync(async (req, res, next) => {
    const { sessionId } = req.params;

    if (!sessionId) {
        return next(new ApiError('Session ID is required', 400));
    }
    const session = await Session.findById(sessionId).select("syllabusId");
    // console.log(session);

    if (!session) {
        return next(new ApiError('Session not found', 404));
    }

    const syllabusId = session.syllabusId;



    let subjects = await Subject.find({ syllabusId })
        .select('-createdAt -updatedAt -__v')
        .populate({ path: 'categoryId', select: 'name' });
    subjects = subjects.map((subject) => {
        return {
            _id: subject._id,
            name: subject.name,
            category: subject.categoryId.name,
            code: subject.code
        }
    })


    res.status(200).json({
        status: 'success',
        results: subjects.length,
        data: subjects,

    });
}

);
