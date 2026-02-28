import axios from "axios";
import { config } from "../configs/env.js";

const brevoClient = axios.create({
  baseURL: "https://api.brevo.com/v3",
  headers: {
    "api-key": config.BREVO_API_KEY,
    "Content-Type": "application/json"
  }
});

// Helper function to get logo URL from Cloudinary
const getLogoUrl = () => {
  // Your Cloudinary logo URL
  return "https://res.cloudinary.com/dehmhdpqn/image/upload/v1772201253/logooo_v1wlze.png";
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    await brevoClient.post("/smtp/email", {
      sender: {
        name: config.BREVO_SENDER_NAME,
        email: config.BREVO_SENDER_EMAIL
      },
      to: [{ email: to }],
      subject,
      htmlContent: html
    });
  } catch (err) {
    console.error("Brevo email error:", err.response?.data || err.message);
  }
};

/**
 * Send admin credentials email
 * 
 * 
 */

export const sendCourseEnrollmentSuccessMail = async ({
  studentEmail,
  studentName,
  courseTitle,
  amountPaid,
  paymentMode
}) => {
  const LOGO_URL = getLogoUrl();

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background:#f5f5f5; padding:30px;">
      <div style="max-width:600px; margin:auto; background:white; border-radius:16px; overflow:hidden;">
        
        <div style="background:#74271E; padding:30px; text-align:center;">
          <img src="${LOGO_URL}" width="70" />
          <h1 style="color:white; margin-top:10px;">Enrollment Confirmed 🎉</h1>
        </div>

        <div style="padding:30px;">
          <h2 style="color:#74271E;">Namaste ${studentName},</h2>

          <p>Your payment was successful and you are now enrolled in:</p>

          <div style="background:#f9f0e3; padding:20px; border-radius:12px;">
            <strong>Course:</strong> ${courseTitle}<br/>
            <strong>Amount Paid:</strong> ₹${amountPaid}<br/>
            <strong>Payment Mode:</strong> ${paymentMode}
          </div>

          <p style="margin-top:20px;">
            You can now access your course from your dashboard.
          </p>

          <a href="${config.FRONTEND_URL}/dashboard"
            style="display:inline-block; margin-top:20px;
                   background:#d6b15c; padding:12px 25px;
                   border-radius:50px; text-decoration:none;
                   color:#74271E; font-weight:bold;">
            Go To Dashboard →
          </a>
        </div>

        <div style="background:#2a0b08; padding:15px; text-align:center; color:#e6d0bd;">
          Kaumudi Sanskrit Academy
        </div>

      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: studentEmail,
    subject: "Enrollment Confirmed - Kaumudi Sanskrit Academy",
    html
  });
};

export const sendAdminCredentialsMail = async ({
  adminEmail,
  adminName,
  password
}) => {
  const LOGO_URL = getLogoUrl();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin Credentials - Kaumudi Sanskrit Academy</title>
    </head>
    <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
      
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 30px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              
              <!-- Header with Logo -->
              <tr>
                <td style="background: linear-gradient(135deg, #3b120e 0%, #5a1e17 50%, #2a0b08 100%); padding: 30px; text-align: center; border-bottom: 2px solid #d6b15c;">
                  <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                    <tr>
                      <td style="background: #74271E; width: 70px; height: 70px; border-radius: 16px; text-align: center; vertical-align: middle; box-shadow: 0 0 25px rgba(214,177,92,0.55);">
                        <img src="${LOGO_URL}" alt="Kaumudi Sanskrit Academy" style="width: 60px; height: 60px; object-fit: contain; display: block; margin: 0 auto; border-radius: 12px;">
                      </td>
                    </tr>
                  </table>
                  <h1 style="color: #ffffff; margin: 15px 0 5px; font-size: 32px; font-weight: 900; letter-spacing: 2px;">KAUMUDI</h1>
                  <p style="color: #d6b15c; margin: 0; font-size: 16px; letter-spacing: 0.18em;">SANSKRIT ACADEMY</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #74271E; margin: 0 0 20px; font-size: 24px; font-weight: 700; border-left: 4px solid #d6b15c; padding-left: 15px;">Welcome to the Administrative Team</h2>
                  
                  <p style="color: #2a0b08; line-height: 1.8; font-size: 16px; margin-bottom: 25px;">
                    Dear <strong style="color: #74271E;">${adminName}</strong>,
                  </p>
                  
                  <p style="color: #2a0b08; line-height: 1.8; font-size: 16px; margin-bottom: 25px;">
                    Your administrator account for Kaumudi Sanskrit Academy has been successfully created. You now have access to the administrative dashboard where you can manage courses, students, and academy operations.
                  </p>
                  
                  <!-- Credentials Box -->
                  <div style="background: linear-gradient(135deg, #fdf8f0 0%, #f9f0e3 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border: 2px solid #dccbb4;">
                    <h3 style="color: #74271E; margin: 0 0 20px; font-size: 18px; font-weight: 700; text-align: center;">◈ Login Credentials ◈</h3>
                    <table width="100%" style="margin-bottom: 15px;">
                      <tr>
                        <td style="padding: 10px; color: #74271E; font-weight: 600; width: 40%;">Email Address:</td>
                        <td style="padding: 10px; color: #2a0b08; font-weight: 500;">${adminEmail}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px; color: #74271E; font-weight: 600;">Password:</td>
                        <td style="padding: 10px; color: #2a0b08; font-weight: 500; font-family: monospace;">${password}</td>
                      </tr>
                    </table>
                    <p style="color: #5a1e17; font-size: 14px; margin: 15px 0 0; text-align: center; border-top: 1px dashed #d6b15c; padding-top: 15px;">
                      <span style="font-size: 16px;">⚠</span> For security reasons, please change your password immediately after first login.
                    </p>
                  </div>
                  
                  <!-- Login Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center">
                        <a href="${config.FRONTEND_URL}/admin-login" style="display: inline-block; background: #d6b15c; color: #74271E; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 10px 20px rgba(214,177,92,0.3); border: 1px solid #74271E;">ACCESS ADMIN DASHBOARD →</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background: linear-gradient(135deg, #2a0b08 0%, #3b120e 100%); padding: 25px; text-align: center; border-top: 2px solid #d6b15c;">
                  <p style="color: #e6d0bd; margin: 0 0 10px; font-size: 14px;">This is an automated message from Kaumudi Sanskrit Academy</p>
                  <p style="color: #d6b15c; margin: 0; font-size: 13px;">Kadi, Mehsana, Gujarat, India</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({
    to: adminEmail,
    subject: "Your Admin Account Credentials - Kaumudi Sanskrit Academy",
    html
  });
};

/**
 * Send password reset email
 */
export const sendResetPasswordMail = async ({
  userEmail,
  userName,
  resetLink
}) => {
  const LOGO_URL = getLogoUrl();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - Kaumudi Sanskrit Academy</title>
    </head>
    <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
      
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 30px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              
              <!-- Header with Logo -->
              <tr>
                <td style="background: linear-gradient(135deg, #3b120e 0%, #5a1e17 50%, #2a0b08 100%); padding: 30px; text-align: center; border-bottom: 2px solid #d6b15c;">
                  <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                    <tr>
                      <td style="background: #74271E; width: 70px; height: 70px; border-radius: 16px; text-align: center; vertical-align: middle; box-shadow: 0 0 25px rgba(214,177,92,0.55);">
                        <img src="${LOGO_URL}" alt="Kaumudi Sanskrit Academy" style="width: 60px; height: 60px; object-fit: contain; display: block; margin: 0 auto; border-radius: 12px;">
                      </td>
                    </tr>
                  </table>
                  <h1 style="color: #ffffff; margin: 15px 0 5px; font-size: 28px; font-weight: 900; letter-spacing: 2px;">KAUMUDI</h1>
                  <p style="color: #d6b15c; margin: 0; font-size: 16px; letter-spacing: 0.18em;">SANSKRIT ACADEMY</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #74271E; margin: 0 0 20px; font-size: 24px; font-weight: 700; border-left: 4px solid #d6b15c; padding-left: 15px;">Password Reset Request</h2>
                  
                  <p style="color: #2a0b08; line-height: 1.8; font-size: 16px; margin-bottom: 20px;">
                    Hello <strong style="color: #74271E;">${userName}</strong>,
                  </p>
                  
                  <p style="color: #2a0b08; line-height: 1.8; font-size: 16px; margin-bottom: 25px;">
                    We received a request to reset your password for your Kaumudi Sanskrit Academy account. Click the button below to create a new password.
                  </p>
                  
                  <!-- Reset Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${resetLink}" style="display: inline-block; background: #d6b15c; color: #74271E; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 10px 20px rgba(214,177,92,0.3); border: 1px solid #74271E;">RESET PASSWORD →</a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Expiry Notice -->
                  <div style="background-color: #f9f0e3; border-radius: 8px; padding: 15px; margin: 25px 0; border-left: 4px solid #d6b15c;">
                    <p style="color: #74271E; margin: 0; font-size: 14px;">
                      <span style="font-size: 16px; margin-right: 8px;">⏰</span> 
                      This password reset link will expire in <strong>15 minutes</strong> for security reasons.
                    </p>
                  </div>
                  
                  <p style="color: #5a1e17; line-height: 1.6; font-size: 14px; margin-top: 25px;">
                    If you did not request a password reset, please ignore this email or contact our support team if you have concerns about your account security.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background: linear-gradient(135deg, #2a0b08 0%, #3b120e 100%); padding: 25px; text-align: center; border-top: 2px solid #d6b15c;">
                  <p style="color: #e6d0bd; margin: 0; font-size: 13px;">This is an automated message from Kaumudi Sanskrit Academy</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({
    to: userEmail,
    subject: "Password Reset Request - Kaumudi Sanskrit Academy",
    html
  });
};

/**
 * Send inquiry notification to admin
 */
export const sendInquiryMailToAdmin = async (inquiry) => {
  const LOGO_URL = getLogoUrl();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Course Inquiry - Kaumudi Sanskrit Academy</title>
    </head>
    <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
      
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 30px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              
              <!-- Header with Logo -->
              <tr>
                <td style="background: linear-gradient(135deg, #3b120e 0%, #5a1e17 50%, #2a0b08 100%); padding: 25px; text-align: center; border-bottom: 2px solid #d6b15c;">
                  <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                    <tr>
                      <td style="background: #74271E; width: 60px; height: 60px; border-radius: 16px; text-align: center; vertical-align: middle; box-shadow: 0 0 25px rgba(214,177,92,0.55);">
                        <img src="${LOGO_URL}" alt="Kaumudi Sanskrit Academy" style="width: 50px; height: 50px; object-fit: contain; display: block; margin: 0 auto; border-radius: 12px;">
                      </td>
                    </tr>
                  </table>
                  <h1 style="color: #ffffff; margin: 10px 0 5px; font-size: 26px; font-weight: 900;">NEW COURSE INQUIRY</h1>
                  <p style="color: #d6b15c; margin: 0; font-size: 14px; letter-spacing: 0.18em;">ADMIN NOTIFICATION</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  
                  <!-- Alert Box -->
                  <div style="background: linear-gradient(135deg, #fdf8f0 0%, #f9f0e3 100%); border-left: 6px solid #d6b15c; padding: 15px 20px; margin-bottom: 25px; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0; color: #74271E; font-weight: 700; font-size: 18px;">◈ New Inquiry Received ◈</p>
                  </div>
                  
                  <!-- Inquiry Details Table -->
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                    <tr>
                      <td style="padding: 12px; background: #f9f0e3; font-weight: 700; width: 35%; color: #74271E; border-radius: 8px 0 0 8px;">Full Name:</td>
                      <td style="padding: 12px; background: #ffffff; border: 2px solid #f9f0e3; border-radius: 0 8px 8px 0;">${inquiry.fullName}</td>
                    </tr>
                    ${inquiry.vedicName ? `
                    <tr>
                      <td style="padding: 12px; background: #f9f0e3; font-weight: 700; color: #74271E;">Vedic Name:</td>
                      <td style="padding: 12px; background: #ffffff; border: 2px solid #f9f0e3;">${inquiry.vedicName}</td>
                    </tr>` : ''}
                    <tr>
                      <td style="padding: 12px; background: #f9f0e3; font-weight: 700; color: #74271E;">Email Address:</td>
                      <td style="padding: 12px; background: #ffffff; border: 2px solid #f9f0e3;">${inquiry.email}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; background: #f9f0e3; font-weight: 700; color: #74271E;">Phone Number:</td>
                      <td style="padding: 12px; background: #ffffff; border: 2px solid #f9f0e3;">${inquiry.whatsappNumber}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; background: #f9f0e3; font-weight: 700; color: #74271E;">Preferred Level:</td>
                      <td style="padding: 12px; background: #ffffff; border: 2px solid #f9f0e3;">${inquiry.preferredLevel}</td>
                    </tr>
                  </table>
                  
                  <!-- Message Box -->
                  <div style="margin: 25px 0; padding: 20px; background: #f9f0e3; border-radius: 8px; border: 2px solid #dccbb4;">
                    <h3 style="color: #74271E; margin: 0 0 10px; font-size: 16px; font-weight: 700;">Message:</h3>
                    <p style="color: #2a0b08; line-height: 1.6; margin: 0; font-style: italic;">"${inquiry.message}"</p>
                  </div>
                  
                  <!-- Action Buttons -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center">
                        <a href="mailto:${inquiry.email}" style="display: inline-block; background: #74271E; color: #ffffff; padding: 12px 25px; border-radius: 50px; text-decoration: none; font-weight: 600; margin: 5px; border: 1px solid #d6b15c;">✉ REPLY TO INQUIRY</a>
                        <a href="${config.FRONTEND_URL}/admin/inquiries" style="display: inline-block; background: #d6b15c; color: #74271E; padding: 12px 25px; border-radius: 50px; text-decoration: none; font-weight: 600; margin: 5px; border: 1px solid #74271E;">◈ VIEW ALL INQUIRIES</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background: linear-gradient(135deg, #2a0b08 0%, #3b120e 100%); padding: 20px; text-align: center; border-top: 2px solid #d6b15c;">
                  <p style="color: #e6d0bd; margin: 0; font-size: 12px;">Received on ${new Date(inquiry.createdAt).toLocaleString()}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await brevoClient.post(
    "/smtp/email",
    {
      sender: {
        name: "Kaumudi Sanskrit Academy",
        email: config.BREVO_SENDER_EMAIL
      },
      to: [
        {
          email: config.ADMIN_EMAIL,
          name: "Admin"
        }
      ],
      subject: "New Course Inquiry - Kaumudi Sanskrit Academy",
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

/**
 * Send contact form submission to admin
 */
export const sendContactMailToAdmin = async (contact) => {
  const LOGO_URL = getLogoUrl();
  console.log("Sending contact mail to:", config.ADMIN_EMAIL);
  console.log("Brevo key exists:", !!config.BREVO_API_KEY);
  console.log("Sender email:", config.BREVO_SENDER_EMAIL);
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form - Kaumudi Sanskrit Academy</title>
    </head>
    <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
      
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 30px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              
              <!-- Header with Logo -->
              <tr>
                <td style="background: linear-gradient(135deg, #3b120e 0%, #5a1e17 50%, #2a0b08 100%); padding: 25px; text-align: center; border-bottom: 2px solid #d6b15c;">
                  <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                    <tr>
                      <td style="background: #74271E; width: 60px; height: 60px; border-radius: 16px; text-align: center; vertical-align: middle; box-shadow: 0 0 25px rgba(214,177,92,0.55);">
                        <img src="${LOGO_URL}" alt="Kaumudi Sanskrit Academy" style="width: 50px; height: 50px; object-fit: contain; display: block; margin: 0 auto; border-radius: 12px;">
                      </td>
                    </tr>
                  </table>
                  <h1 style="color: #ffffff; margin: 10px 0 5px; font-size: 26px; font-weight: 900;">CONTACT FORM SUBMISSION</h1>
                  <p style="color: #d6b15c; margin: 0; font-size: 14px; letter-spacing: 0.18em;">ADMIN NOTIFICATION</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  
                  <!-- Alert Box -->
                  <div style="background: linear-gradient(135deg, #fdf8f0 0%, #f9f0e3 100%); border-left: 6px solid #d6b15c; padding: 15px 20px; margin-bottom: 25px; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0; color: #74271E; font-weight: 700; font-size: 18px;">◈ New Contact Message ◈</p>
                  </div>
                  
                  <!-- Contact Details Table -->
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                    <tr>
                      <td style="padding: 12px; background: #f9f0e3; font-weight: 700; width: 35%; color: #74271E; border-radius: 8px 0 0 8px;">Full Name:</td>
                      <td style="padding: 12px; background: #ffffff; border: 2px solid #f9f0e3; border-radius: 0 8px 8px 0;">${contact.fullName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; background: #f9f0e3; font-weight: 700; color: #74271E;">Email Address:</td>
                      <td style="padding: 12px; background: #ffffff; border: 2px solid #f9f0e3;">${contact.email}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; background: #f9f0e3; font-weight: 700; color: #74271E;">Subject:</td>
                      <td style="padding: 12px; background: #ffffff; border: 2px solid #f9f0e3;">${contact.subject}</td>
                    </tr>
                  </table>
                  
                  <!-- Message Box -->
                  <div style="margin: 25px 0; padding: 20px; background: #f9f0e3; border-radius: 8px; border: 2px solid #dccbb4;">
                    <h3 style="color: #74271E; margin: 0 0 10px; font-size: 16px; font-weight: 700;">Message:</h3>
                    <p style="color: #2a0b08; line-height: 1.6; margin: 0; font-style: italic;">"${contact.message}"</p>
                  </div>
                  
                  <!-- Reply Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center">
                        <a href="mailto:${contact.email}?subject=Re: ${contact.subject}" style="display: inline-block; background: #74271E; color: #ffffff; padding: 14px 30px; border-radius: 50px; text-decoration: none; font-weight: 600; border: 1px solid #d6b15c;">✉ REPLY TO SENDER</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background: linear-gradient(135deg, #2a0b08 0%, #3b120e 100%); padding: 20px; text-align: center; border-top: 2px solid #d6b15c;">
                  <p style="color: #e6d0bd; margin: 0; font-size: 12px;">Submitted on ${new Date(contact.createdAt).toLocaleString()}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({
    to: config.ADMIN_EMAIL,
    subject: "New Contact Form Submission - Kaumudi Sanskrit Academy",
    html
  });
};

/**
 * Send subscription confirmation email to subscriber
 */
export const sendSubscriptionConfirmation = async ({ email }) => {
  const LOGO_URL = getLogoUrl();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Kaumudi Sanskrit Academy</title>
    </head>
    <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
      
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 30px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              
              <!-- Header with Logo -->
              <tr>
                <td style="background: linear-gradient(135deg, #3b120e 0%, #5a1e17 50%, #2a0b08 100%); padding: 30px; text-align: center; border-bottom: 2px solid #d6b15c;">
                  <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                    <tr>
                      <td style="background: #74271E; width: 80px; height: 80px; border-radius: 16px; text-align: center; vertical-align: middle; box-shadow: 0 0 25px rgba(214,177,92,0.55);">
                        <img src="${LOGO_URL}" alt="Kaumudi Sanskrit Academy" style="width: 70px; height: 70px; object-fit: contain; display: block; margin: 0 auto; border-radius: 12px;">
                      </td>
                    </tr>
                  </table>
                  <h1 style="color: #ffffff; margin: 15px 0 5px; font-size: 36px; font-weight: 900; letter-spacing: 2px;">KAUMUDI</h1>
                  <p style="color: #d6b15c; margin: 0; font-size: 18px; letter-spacing: 0.18em;">SANSKRIT ACADEMY</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #74271E; margin: 0 0 20px; font-size: 28px; font-weight: 700; border-left: 4px solid #d6b15c; padding-left: 15px;">Welcome to Our Wisdom Circle</h2>
                  
                  <p style="color: #2a0b08; line-height: 1.8; font-size: 16px; margin-bottom: 20px;">
                    <strong style="color: #74271E;">Praṇāma,</strong>
                  </p>
                  
                  <p style="color: #2a0b08; line-height: 1.8; font-size: 16px; margin-bottom: 25px;">
                    Thank you for subscribing to Kaumudi Sanskrit Academy. You are now part of a community dedicated to reviving and preserving the timeless wisdom of Sanskrit.
                  </p>
                  
                  <p style="color: #74271E; font-weight: 600; margin-bottom: 15px; font-size: 18px;">As a subscriber, you'll receive:</p>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 8px 0;">
                        <table>
                          <tr>
                            <td width="30" style="color: #d6b15c; font-size: 20px; font-weight: bold;">◈</td>
                            <td style="color: #2a0b08;">Weekly Sanskrit shloka teachings</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <table>
                          <tr>
                            <td width="30" style="color: #d6b15c; font-size: 20px; font-weight: bold;">◈</td>
                            <td style="color: #2a0b08;">Course updates and new offerings</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <table>
                          <tr>
                            <td width="30" style="color: #d6b15c; font-size: 20px; font-weight: bold;">◈</td>
                            <td style="color: #2a0b08;">Exclusive workshop invitations</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <table>
                          <tr>
                            <td width="30" style="color: #d6b15c; font-size: 20px; font-weight: bold;">◈</td>
                            <td style="color: #2a0b08;">Free learning resources and e-books</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Courses Preview -->
                  <div style="background: linear-gradient(135deg, #fdf8f0 0%, #f9f0e3 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border: 2px solid #dccbb4;">
                    <h3 style="color: #74271E; margin: 0 0 20px; font-size: 20px; font-weight: 700; text-align: center;">Our Popular Courses</h3>
                    <table width="100%" style="border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px; color: #2a0b08; border-bottom: 1px dashed #d6b15c;">◈ Shlokas & Chanting</td>
                        <td style="padding: 8px; color: #2a0b08; border-bottom: 1px dashed #d6b15c;">◈ Spoken Sanskrit</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; color: #2a0b08;">◈ Vyakaran Shastra</td>
                        <td style="padding: 8px; color: #2a0b08;">◈ UGC NET Preparation</td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- Contact Information -->
                  <table width="100%" style="margin: 25px 0; background: linear-gradient(135deg, #fdf8f0 0%, #f9f0e3 100%); border-radius: 12px; padding: 20px; border: 2px solid #dccbb4;">
                    <tr>
                      <td style="padding: 8px; color: #74271E;">
                        <span style="font-size: 18px; margin-right: 10px;">⌂</span> <strong>Our Location:</strong><br>
                        <span style="color: #2a0b08; margin-left: 28px;">Kadi, Mehsana, Gujarat, India</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; color: #74271E;">
                        <span style="font-size: 18px; margin-right: 10px;">✉</span> <strong>Email:</strong><br>
                        <span style="color: #2a0b08; margin-left: 28px;">ksacademy@gmail.com</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; color: #74271E;">
                        <span style="font-size: 18px; margin-right: 10px;">☎</span> <strong>Phone:</strong><br>
                        <span style="color: #2a0b08; margin-left: 28px;">+91 75672 23072</span>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center">
                        <a href="${config.FRONTEND_URL}/courses" style="display: inline-block; background: #d6b15c; color: #74271E; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 10px 20px rgba(214,177,92,0.3); border: 1px solid #74271E;">EXPLORE OUR COURSES →</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background: linear-gradient(135deg, #2a0b08 0%, #3b120e 100%); padding: 30px; text-align: center; border-top: 2px solid #d6b15c;">
                  <p style="color: #d6b15c; margin: 0 0 15px; font-size: 14px;">
                    © 2026 Kaumudi Sanskrit Academy. All Wisdom Reserved.
                  </p>
                  <p style="margin: 0;">
                    <a href="${config.FRONTEND_URL}/privacy" style="color: #e6d0bd; text-decoration: none; margin: 0 12px; font-size: 13px;">Privacy</a>
                    <span style="color: #dccbb4;">|</span>
                    <a href="${config.FRONTEND_URL}/terms" style="color: #e6d0bd; text-decoration: none; margin: 0 12px; font-size: 13px;">Terms</a>
                    <span style="color: #dccbb4;">|</span>
                    <a href="${config.FRONTEND_URL}/cookies" style="color: #e6d0bd; text-decoration: none; margin: 0 12px; font-size: 13px;">Cookies</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: "Welcome to Kaumudi Sanskrit Academy - Subscription Confirmed",
    html
  });
};

/**
 * Send admin notification about new subscriber
 */
export const sendSubscriptionAdminNotification = async ({ email }) => {
  const LOGO_URL = getLogoUrl();

  // Get total subscriber count for stats (you'll need to implement this)
  // const { Subscriber } = await import('../models/Subscriber.model.js');
  // const totalSubscribers = await Subscriber.countDocuments({ status: 'active' });
  const totalSubscribers = "---"; // Placeholder

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Subscriber Alert - Kaumudi Sanskrit Academy</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5; padding: 30px 20px; margin: 0;">
      
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <!-- Header with Logo -->
        <div style="background: linear-gradient(135deg, #3b120e 0%, #5a1e17 50%, #2a0b08 100%); padding: 25px; text-align: center; border-bottom: 2px solid #d6b15c;">
          <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
            <tr>
              <td style="background: #74271E; width: 70px; height: 70px; border-radius: 16px; text-align: center; vertical-align: middle; box-shadow: 0 0 25px rgba(214,177,92,0.55);">
                <img src="${LOGO_URL}" alt="Kaumudi Sanskrit Academy" style="width: 60px; height: 60px; object-fit: contain; display: block; margin: 0 auto; border-radius: 12px;">
              </td>
            </tr>
          </table>
          <h1 style="color: #ffffff; margin: 10px 0 5px; font-size: 28px; font-weight: 900; letter-spacing: 1px;">KAUMUDI SANSKRIT ACADEMY</h1>
          <p style="color: #d6b15c; margin: 0; font-size: 16px; letter-spacing: 0.18em;">ADMIN NOTIFICATION</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 35px;">
          
          <!-- Alert Box -->
          <div style="background: linear-gradient(135deg, #fdf8f0 0%, #f9f0e3 100%); border-left: 6px solid #d6b15c; padding: 20px; margin-bottom: 30px; border-radius: 0 12px 12px 0;">
            <p style="margin: 0; color: #74271E; font-weight: 700; font-size: 20px;">◈ New Subscriber Alert ◈</p>
          </div>
          
          <!-- Subscriber Details Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <tr>
              <td style="padding: 15px; background: linear-gradient(135deg, #fdf8f0 0%, #f9f0e3 100%); font-weight: 700; width: 40%; color: #74271E; border-radius: 8px 0 0 8px;">Email Address:</td>
              <td style="padding: 15px; background-color: #ffffff; border: 2px solid #f9f0e3; border-radius: 0 8px 8px 0;">
                <strong style="color: #74271E; font-size: 16px;">${email}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding: 15px; background: linear-gradient(135deg, #fdf8f0 0%, #f9f0e3 100%); font-weight: 700; color: #74271E; border-radius: 8px 0 0 8px;">Subscription Date:</td>
              <td style="padding: 15px; background-color: #ffffff; border: 2px solid #f9f0e3; border-radius: 0 8px 8px 0;">
                <span style="color: #2a0b08;">${new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 15px; background: linear-gradient(135deg, #fdf8f0 0%, #f9f0e3 100%); font-weight: 700; color: #74271E; border-radius: 8px 0 0 8px;">Source:</td>
              <td style="padding: 15px; background-color: #ffffff; border: 2px solid #f9f0e3; border-radius: 0 8px 8px 0;">
                <span style="color: #2a0b08;">Website Footer Subscription Form</span>
              </td>
            </tr>
          </table>
          
          <!-- Stats Box -->
          <div style="margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #fdf8f0 0%, #f9f0e3 100%); border-radius: 12px; border: 2px solid #dccbb4;">
            <h3 style="color: #74271E; margin: 0 0 20px; font-size: 20px; font-weight: 700; text-align: center;">📊 Subscription Statistics</h3>
            <table style="width: 100%;">
              <tr>
                <td style="text-align: center; padding: 10px;">
                  <div style="font-size: 36px; font-weight: 900; color: #74271E;">${totalSubscribers}</div>
                  <div style="color: #5a1e17; font-size: 14px; font-weight: 600;">TOTAL SUBSCRIBERS</div>
                </td>
                <td style="text-align: center; padding: 10px;">
                  <div style="font-size: 36px; font-weight: 900; color: #d6b15c;">+1</div>
                  <div style="color: #5a1e17; font-size: 14px; font-weight: 600;">NEW TODAY</div>
                </td>
              </tr>
            </table>
          </div>
          
          <!-- Action Buttons -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="padding: 10px;">
                <a href="mailto:${email}" style="display: inline-block; background: #74271E; color: #ffffff; padding: 14px 30px; border-radius: 50px; text-decoration: none; font-weight: 600; margin: 5px; border: 1px solid #d6b15c;">✉ SEND WELCOME EMAIL</a>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 10px;">
                <a href="${config.FRONTEND_URL}/admin/subscribers" style="display: inline-block; background: #d6b15c; color: #74271E; padding: 14px 30px; border-radius: 50px; text-decoration: none; font-weight: 600; margin: 5px; border: 1px solid #74271E;">◈ VIEW ALL SUBSCRIBERS</a>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Footer -->
        <div style="background: linear-gradient(135deg, #2a0b08 0%, #3b120e 100%); padding: 20px; text-align: center; border-top: 2px solid #d6b15c;">
          <p style="margin: 0; color: #e6d0bd; font-size: 13px; line-height: 1.6;">
            This is an automated notification from Kaumudi Sanskrit Academy<br>
            <span style="color: #d6b15c;">Kadi, Mehsana, Gujarat, India</span>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: config.ADMIN_EMAIL,
    subject: "New Subscriber Alert - Kaumudi Sanskrit Academy",
    html
  });
};