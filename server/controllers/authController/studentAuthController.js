const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const Student = require('../../models/Student');
const StudentMaster = require('../../models/StudentMaster');
const Session = require('../../models/Session');
const Subject = require('../../models/Subject');
const jwt = require('jsonwebtoken');
const Department = require('../../models/Department');
const Level = require('../../models/Level');
const Program = require('../../models/Program');
const Course = require('../../models/Course');
const Semester = require('../../models/Semester');


const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';
let refreshToken = null;

// generate access token
const generateAccessToken = (student) => {
  const payload = {
    id: student._id,
    email: student.email,
    name: student.name,
    phone: student.phone,
    role: "student"
  };

  return jwt.sign(payload, accessTokenSecret, { expiresIn: '15m' });
};

// generate refresh token
const generateRefreshToken = (student) => {
  const payload = {
    id: student._id,
    email: student.email,
    name: student.name,
    phone: student.phone,
    role: "student"
  };

  refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: '7d' });
  return refreshToken;
};


// registration
exports.registerStudent = catchAsync(async (req, res, next) => {
  const { name, phone, email, password, rollNumber, registrationNumber, departmentId, levelId, programId, courseId, semesterId} = req.body;

  if (!name || !phone || !email || !password || !departmentId || !levelId || !programId || !courseId || !semesterId || !rollNumber || !registrationNumber) {
    return next(new ApiError('All fields are required', 400));
  }

  // Check if student already exists
  const existingStudent = await Student.findOne({ 
    $or: [{ email }, { rollNumber }, { registrationNumber }] 
  });
  
  if (existingStudent) {
    return next(new ApiError('Student already registered with this email, roll number, or registration number', 400));
  }

  // Get the current session using getAllSessionsBySemester logic
  const sessions = await Session.find({ semesterId }).sort({ createdAt: -1 });

  if (!sessions.length) {
    return next(new ApiError('No sessions found for this semester', 404));
  }

  const currentSession = sessions[0];

  // Fetch subjects for the current session using syllabusId
  const subjects = await Subject.find({ syllabusId: currentSession.syllabusId });

  // Create student
  const student = await Student.create({
    name,
    phone,
    email,
    password,
    rollNumber,
    registrationNumber,
    sessionId: [currentSession._id]
  });

  // Create multiple studentMaster entries for each subject
  const studentMasterEntries = subjects.map(subject => ({
    studentId: student._id,
    departmentId,
    levelId,
    programId,
    courseId,
    semesterId,
    sessionId: currentSession._id,
    syllabusId: currentSession.syllabusId,
    subjectId: subject._id,
    categoryId: subject.categoryId,
    enrolledAt: new Date(),
    status: 'studying'
  }));

  await StudentMaster.insertMany(studentMasterEntries);

  res.status(201).json({
    status: 'success',
    message: 'Student registered successfully',
    data: {
      student,
      studentMasterEntries
    }
  });
});



// login
exports.loginStudent = catchAsync(async (req, res, next) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return next(new ApiError('Identifier and Password are required', 400));
  }

  const student = await Student.findOne({
    $or: [
      { email: identifier },
      { rollNumber: identifier },
      { registrationNumber: identifier }
    ]
  });
  
  if (!student) {
    return next(new ApiError('Invalid credentials', 401));
  }

  const isPasswordValid = await student.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return next(new ApiError('Invalid credentials', 401));
  }

  const accessToken = generateAccessToken(student);
  const refreshToken = generateRefreshToken(student);

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    student,
    data: {
      accessToken,
      refreshToken
    }
  });
});



// logout
exports.logoutStudent = catchAsync(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, accessTokenSecret, (err) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    refreshToken = null; // Invalidate the single refresh token
    res.status(200).json({ 
      status: 'success', 
      message: 'Logged out successfully' 
    });
  });
});


// generate new access token using refresh token
exports.generateNewAccessTokenStudent = catchAsync(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || token !== refreshToken) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  jwt.verify(token, refreshTokenSecret, (err, student) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken(student);
    res.json({ 
      status: 'success',
      accessToken 
    });
  });
});


// get student info
exports.getStudentInfo = catchAsync(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, accessTokenSecret, async (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });

    const student = await Student.findById(decoded.id);
    if (!student) return next(new ApiError('Student not found', 404));

    const studentMaster = await StudentMaster.findOne({ studentId: student._id });
    if (!studentMaster) return next(new ApiError('Student details not found', 404));

    const [department, level, program, course, semester, session, subjects] = await Promise.all([
      Department.findById(studentMaster.departmentId),
      Level.findById(studentMaster.levelId),
      Program.findById(studentMaster.programId),
      Course.findById(studentMaster.courseId),
      Semester.findById(studentMaster.semesterId),
      Session.findById(studentMaster.sessionId),
      Subject.find({ syllabusId: studentMaster.syllabusId }).populate('categoryId')
    ]);

    const syllabus = subjects.map(subject => ({
      subjectName: subject.name,
      subjectCode: subject.code,
      category: subject.categoryId?.name || 'Unknown'
    }));

    res.status(200).json({
      status: 'success',
      data: {
        name: student.name,
        email: student.email,
        phone: student.phone,
        rollNumber: student.rollNumber,
        registrationNumber: student.registrationNumber,
        departmentName: department?.name,
        levelName: level?.name,
        programName: program?.name,
        courseName: course?.name,
        semesterName: semester?.name,
        sessionName: session?.name,
        syllabus,
        isVerified: student.isVerified,
        promoteFlag: student.promote_flag
      }
    });
  });
})