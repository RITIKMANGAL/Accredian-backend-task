import express from 'express';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();

// Configure Nodemailer transporter for Gmail using OAuth2
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.GMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    accessToken: process.env.GMAIL_ACCESS_TOKEN, // Optional if required
  },
});

// Helper function to send a referral email
const sendReferralEmail = async (referral) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: referral.referrerEmail,
    subject: 'Thank you for your referral!',
    text: `Hello ${referral.referrerName},

Thank you for referring ${referral.refereeName} to our courses. We appreciate your support!

Best regards,
Your Team`,
  };

  return transporter.sendMail(mailOptions);
};

// POST /api/referrals
router.post('/', async (req, res) => {
  try {
    const { referrerName, referrerEmail, referrerPhone, refereeName, refereeEmail, refereePhone } = req.body;

    // Basic validation
    if (!referrerName || !referrerEmail || !refereeName || !refereeEmail) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Save referral data in the database
    const newReferral = await prisma.referral.create({
      data: {
        referrerName,
        referrerEmail,
        referrerPhone,
        refereeName,
        refereeEmail,
        refereePhone,
      },
    });

    // Send referral email notification
    await sendReferralEmail(newReferral);

    res.status(201).json({ message: 'Referral submitted successfully', referral: newReferral });
  } catch (error) {
    console.error('Error submitting referral:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
