const jwt = require('jsonwebtoken');
const Teacher = require('../../models/Teacher');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');


const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';
let refreshToken = null;

// generate access token
const generateAccessToken = (teacher) => {
    const payload = {
        id: teacher._id,
        email: teacher.email,
        name: teacher.name,
        phone: teacher.phone,
        role: "teacher"
    };

    return jwt.sign(payload, accessTokenSecret, { expiresIn: '15m' });
};

// generate refresh token
const generateRefreshToken = (teacher) => {
    const payload = {
        id: teacher._id,
        email: teacher.email,
        name: teacher.name,
        phone: teacher.phone,
        role: "teacher"
    };

    refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: '7d' });
    return refreshToken;
};


// registration
exports.registerTeacher = catchAsync(async (req, res, next) => {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !email || !password) {
        return next(new ApiError('All fields are required', 400));
    }

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
        return next(new ApiError('Teacher already registered', 400));
    }

    const teacher = await Teacher.create({
        name,
        phone,
        email,
        password
    });

    res.status(201).json({
        status: 'success',
        message: 'Teacher registered successfully',
        data: {
            teacher
        }
    });
})


// login
exports.loginTeacher = catchAsync(async (req, res, next) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return next(new ApiError('Email and password are required', 400));
    }

    const teacher = await Teacher.findOne({ email: identifier });
    if (!teacher) {
        return next(new ApiError('Invalid credentials', 401));
    }

    const isPasswordValid = await teacher.isPasswordCorrect(password);
    if (!isPasswordValid) {
        return next(new ApiError('Invalid credentials', 401));
    }

    const accessToken = generateAccessToken(teacher);
    const refreshToken = generateRefreshToken(teacher);

    res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
            accessToken,
            refreshToken
        }
    });
});



// logout
exports.logoutTeacher = catchAsync(async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access token required' });

    jwt.verify(token, accessTokenSecret, (err) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        refreshToken = null;
        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully'
        });
    });
});


// generate new access token
exports.generateNewAccessTokenTeacher = catchAsync(async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || token !== refreshToken) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }

    jwt.verify(token, refreshTokenSecret, (err, teacher) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken(teacher);
        res.json({
            status: 'success',
            accessToken
        });
    });
});


// get teacher info
exports.getTeacherInfo = catchAsync(async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access token required' });

    jwt.verify(token, accessTokenSecret, async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });

        const teacher = await Teacher.findById(decoded.id);
        if (!teacher) return next(new ApiError('Teacher not found', 404));

        res.status(200).json({
            status: 'success',
            data: {
                name: teacher.name,
                email: teacher.email,
                phone: teacher.phone
            }
        });
    });
});