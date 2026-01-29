import axios from "axios";
import { config } from "../configs/env.js";


const brevoClient = axios.create({
  baseURL: "https://api.brevo.com/v3",
  headers: {
    "api-key": config.BREVO_API_KEY,
    "Content-Type": "application/json"
  }
});


const sendEmail = async ({ to, subject, html }) => {
  await brevoClient.post("/smtp/email", {
    sender: {
      name: "Kaumudi Sanskrit Academy",
      email: config.BREVO_SENDER_EMAIL
    },
    to: [{ email: to }],
    subject,
    htmlContent: html
  });
};



export const sendAdminCredentialsMail = async ({
  adminEmail,
  adminName,
  password
}) => {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6;">
      <h2>Welcome to Kaumudi Sanskrit Academy</h2>
      <p>Dear <b>${adminName}</b>,</p>

      <p>Your <b>Admin account</b> has been successfully created.</p>

      <p><b>Login Credentials:</b></p>
      <p>
        Email: <b>${adminEmail}</b><br/>
        Password: <b>${password}</b>
      </p>

      <p>
        For security reasons, please login and change your password immediately.
      </p>

      <p>
        Login URL:<br/>
        <a href="${config.FRONTEND_URL}/login">
          ${config.FRONTEND_URL}/login
        </a>
      </p>

      <br/>
      <p>Regards,<br/>
      <b>Kaumudi Sanskrit Academy</b></p>
    </div>
  `;

  await sendEmail({
    to: adminEmail,
    subject: "Your Admin Account Credentials",
    html
  });
};



export const sendResetPasswordMail = async ({
  userEmail,
  userName,
  resetLink
}) => {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6;">
      <h2>Password Reset Request</h2>

      <p>Hello <b>${userName}</b>,</p>

      <p>
        We received a request to reset your password.
        Click the button below to set a new password.
      </p>

      <p style="margin:20px 0;">
        <a href="${resetLink}"
           style="background:#4f46e5;color:#fff;
                  padding:12px 20px;
                  text-decoration:none;
                  border-radius:6px;">
          Reset Password
        </a>
      </p>

      <p>
        This link will expire in <b>15 minutes</b>.
      </p>

      <p>
        If you did not request this, please ignore this email.
      </p>

      <br/>
      <p>Regards,<br/>
      <b>Kaumudi Sanskrit Academy</b></p>
    </div>
  `;

  await sendEmail({
    to: userEmail,
    subject: "Reset Your Password",
    html
  });
};




export const sendInquiryMailToAdmin = async (inquiry) => {
  const html = `
    <h2>📩 New Course Inquiry</h2>
    <p><b>Full Name:</b> ${inquiry.fullName}</p>
    <p><b>Vedic Name:</b> ${inquiry.vedicName || "N/A"}</p>
    <p><b>Email:</b> ${inquiry.email}</p>
    <p><b>Phone:</b> ${inquiry.phoneNumber}</p>
    <p><b>Preferred Level:</b> ${inquiry.preferredLevel}</p>
    <p><b>Message:</b></p>
    <p>${inquiry.message}</p>
    <hr />
    <small>Kaumudi Sanskrit Academy – Inquiry System</small>
  `;

  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: "Kaumudi Website",
        email: config.ADMIN_EMAIL
      },
      to: [
        {
          email: config.ADMIN_EMAIL,
          name: "Admin"
        }
      ],
      subject: "📨 New Student Inquiry Received",
      htmlContent: html
    },
    {
      headers: {
        "api-key": config.BREVO_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );
};
