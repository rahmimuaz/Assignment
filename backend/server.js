import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import passport from 'passport';
import { passportSetup } from './passport.js'; 
import userRouter from './routes/userRoute.js';
import studentRouter from './routes/studentRoutes.js';
import authRoute from './routes/auth.js'; 

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
};
connectDB();


passportSetup(); 
app.use(
  cookieSession({
    name: 'session',
    keys: ['cyberwolve'],
    maxAge: 24 * 60 * 100,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/images', express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/students", studentRouter);
app.use("/auth", authRoute); 

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
