import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import passport from 'passport';
import { passportSetup } from './passport.js'; // Corrected import

// Import routes
import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoute.js';
import driverRoutes from './routes/driverRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRouter from './routes/cartRoute.js';
import router from './routes/invoiceRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import repliesRoutes from './routes/replies.js';
import supplierRoutes from './routes/supplierRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import employeeRouter from './routes/employee.js';
import cardRoutes from './routes/cardRoutes.js';
import studentRouter from './routes/studentRoutes.js';
import authRoute from './routes/auth.js';  // Ensure the correct path to your auth.js file

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// MongoDB connection
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

// Passport setup
passportSetup(); // Call passport setup function
app.use(
  cookieSession({
    name: 'session',
    keys: ['cyberwolve'],
    maxAge: 24 * 60 * 100,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Static file serving
app.use('/images', express.static('uploads'));

// API endpoints
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use('/drivers', driverRoutes);
app.use('/api', orderRoutes);
app.use('/api/cart', cartRouter);
app.use('/api/invoice', router);
app.use('/inquiries', inquiryRoutes);
app.use('/replies', repliesRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api', employeeRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/invoice', router); // Ensure clarity with naming
app.use('/api', cardRoutes);

// Role-based login routes
app.use('/api', employeeRouter);

// Student routes
app.use("/api/students", studentRouter);

// Authentication route
app.use("/auth", authRoute); 

// Simple route to test the server
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
