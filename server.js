import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";
import multer from "multer";
dotenv.config();

const app = express();
const prisma = new PrismaClient();
prisma.$connect()
  .then(() => console.log("Database connected successfully"))
  .catch(err => {
    console.error("Database connection error:", err);
    process.exit(1); 
  });

const upload = multer();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['https://accredian-frontend-task-dun-six.vercel.app','http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS']
}));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post("/api/referral", upload.none(), async (req, res) => {
  try {
    const {
      referrerName,
      referrerEmail,
      recipientName,
      recipientEmail,
      recipientPhone,
      course,
    } = req.body;
    if (
      !referrerName ||
      !referrerEmail ||
      !recipientName ||
      !recipientEmail ||
      !recipientPhone ||
      !course
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const referral = await prisma.referral.create({
      data: {
        referrerName,
        referrerEmail,
        recipientName,
        recipientEmail,
        recipientPhone,
        course,
        createdAt: new Date(),
      },
    });
    try {
      const mailOptions = {
        from: `"Referral System" <${process.env.EMAIL_USERNAME}>`,
        to: recipientEmail,
        subject: `${referrerName} has referred you!`,
        html: `
                      <h1>You've been referred by ${referrerName}</h1>
                      <p>${
                        "Course: " + course ||
                        "They thought you might be interested in our services."
                      }</p>
                      <p>From: ${referrerEmail}</p>
                      <p>Click <a href="${
                        process.env.WEBSITE_URL
                      }">here</a> to learn more about our services.</p>
                    `,
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log("Email Error:", error);
    }
    res.status(201).json({
      success: true,
      message: "Referral created successfully",
      data: referral,
    });
  } catch (error) {
    console.error("Error in /api/referral:", error); 
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
