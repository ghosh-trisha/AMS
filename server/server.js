require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./middlewares/error');
const connectDB=require("./config/db")
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/teacher', require('./routes/teacherRoutes'));
// app.use('/api/student', require('./routes/studentRoutes'));

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
(
    async () => {
        await connectDB();
        app.listen(PORT, () =>{ 

            console.log(`Server running on port ${PORT}`)
        });
    }
)();
