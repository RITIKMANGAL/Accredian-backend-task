import express from 'express';
import cors from 'cors';  // Import CORS
import dotenv from 'dotenv';
import referralRoutes from './routes/referrals.js';

dotenv.config();

const app = express();

// 🔹 Enable CORS to allow requests from frontend (Vite default port: 5173)
app.use(cors({
  origin: 'http://localhost:5173',  // Allow frontend to make requests
  credentials: true
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Mount referral API endpoints
app.use('/api/referrals', referralRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
