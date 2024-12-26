import { env } from "@/env";
import { createTransport } from "nodemailer";

export const transporter = createTransport({
  host: env.EMAIL_SERVER_HOST, // e.g., "smtp.gmail.com"
  port: parseInt(env.EMAIL_SERVER_PORT || "587", 10), // e.g., 587
  secure: false, // true for 465, false for other ports
  auth: {
    user: env.EMAIL_SERVER_USER, // Your email
    pass: env.EMAIL_SERVER_PASSWORD, // Your email password or app-specific password
  },
});

//https://chatgpt.com/c/676cd950-a40c-8003-9e5f-915dcb13ccc6
