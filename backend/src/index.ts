/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

const PORT = 5000
import express from 'express';
import apiRouter from './routes/router';
import cookieParser from 'cookie-parser';

const app = express()

//for cookies :D
app.use(cookieParser())

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the main API router under the '/api' base path.
app.use('/api', apiRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});