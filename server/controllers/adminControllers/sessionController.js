const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const Session = require('../../models/Session');
const Syllabus = require('../../models/Syllabus');
const Semester = require('../../models/Semester');
const Subject = require('../../models/Subject');

// Create a new session
exports.createSession = catchAsync(async (req, res, next) => {
    const { academicYear, syllabusId, semesterId } = req.body;

    if (!academicYear || !syllabusId || !semesterId) {
        return next(new ApiError('Academic Year, Syllabus ID, and Semester ID are required', 400));
    }

    // Check if the semester exists
    const semester = await Semester.findById(semesterId);
    if (!semester) {
        return next(new ApiError('Semester not found', 404));
    }

    // Check if the syllabus exists
    const syllabus = await Syllabus.findById(syllabusId);
    if (!syllabus) {
        return next(new ApiError('Syllabus not found', 404));
    }

    // Check if a session with the same academicYear & semester already exists
    const existingSession = await Session.findOne({ academicYear, semesterId });
    if (existingSession) {
        return next(new ApiError(`A session for academic year ${academicYear} already exists for this semester`, 400));
    }

    // Create the session
    const newSession = await Session.create({ academicYear, syllabusId, semesterId });

    res.status(201).json({
        status: 'success',
        data: newSession
    });
});


// Get all sessions by semester
exports.getAllSessionsBySemester = catchAsync(async (req, res, next) => {
    const { semesterId } = req.params;
  
    if (!semesterId) {
      return next(new ApiError('Semester ID is required', 400));
    }
  
    // Check if the semester exists
    const semester = await Semester.findById(semesterId);
    if (!semester) {
      return next(new ApiError('Semester not found', 404));
    }
  
    // Get all sessions for the semester
    const sessions = await Session.find({ semesterId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'syllabusId',
        select: 'name'
      })
      .select('-createdAt -updatedAt -__v');
  
    if (sessions.length === 0) {
      return res.status(400).json({ message: 'No sessions found for this semester' });
    }
  
    // Extract current session and previous sessions
    const currentSession = sessions[0];
    const previousSessions = sessions.slice(1).map(session => session.academicYear);
  
    // Fetch subjects for the current session using syllabusId
    const subjects = await Subject.find({ syllabusId: currentSession.syllabusId._id })
      .populate('categoryId', 'name') // Populate category name
      .select('name code categoryId');
  
    // Attach subjects to the current session
    currentSession._doc.subjects = subjects;
  
    res.status(200).json({
      status: 'success',
      data: {
        currentSession,
        previousSessions
      },
      results: sessions.length
    });
});
