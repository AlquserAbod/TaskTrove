const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const passport = require('./config/passport');
const firebaseConfig = require('./config/FirebaseConfig');
const app = express();

// setup server
const  PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log('server started on port', PORT));

app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());


app.use(cors({
    origin: process.env.APP_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.urlencoded({ extended: true }));

// Set the path to your public uploads directory
app.use(express.static( path.join( __dirname, 'public' ) ))

// initialize firebase App
const firebase = require('firebase/app')
firebase.initializeApp(firebaseConfig);

// connect to mongoDB
mongoose.connect(process.env.MONGODB_URI,{})
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

// routes

app.use('/api/auth',require('./routers/userRouter'));
app.use('/api/auth/verify',require('./routers/emailVerifyRouter'));
app.use('/api/auth/password-reset',require('./routers/passwordResetRouter'));
app.use('/api/auth/google',require('./routers/passportRouter'));
app.use('/api/tasks', require('./routers/taskRouter')); 