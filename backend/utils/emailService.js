const nodemailer = require("nodemailer");

/*
|--------------------------------------------------------------------------
| Transporter
|--------------------------------------------------------------------------
| NOTE: Gmail requires an App Password, not your regular account password,
| once 2-Step Verification is enabled (and Google effectively requires
| this now for third-party apps). Generate one at:
| https://myaccount.google.com/apppasswords
| and set EMAIL_PASS to that 16-character value in your .env file.
|--------------------------------------------------------------------------
*/

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/*
|--------------------------------------------------------------------------
| Send OTP Email
|--------------------------------------------------------------------------
| Returns { success: true, messageId } on success, or
| { success: false, error } on failure — callers should check `success`
| rather than assuming this always resolves cleanly, since email delivery
| is an external dependency that can fail independently of the rest of
| the request (bad credentials, rate limits, network issues, etc.).
|--------------------------------------------------------------------------
*/

const sendOtpEmail = async (email, otp) => {
  if (!email || !otp) {
    throw new Error("sendOtpEmail requires both an email and an OTP.");
  }

  const mailOptions = {
    from: `"Vidya Jyothi Foundation" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Vidya Jyothi Foundation - Email Verification Code",
    html: `
<div style="max-width:650px;margin:auto;font-family:Arial,sans-serif;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">

  <div style="background:#1d4ed8;padding:25px;text-align:center;">

    <h1 style="margin:0;color:white;">
      Vidya Jyothi Foundation
    </h1>

    <p style="margin-top:8px;color:#dbeafe;">
      Scholarship Management System
    </p>

  </div>

  <div style="padding:35px;">

    <h2 style="margin-top:0;color:#111827;">
      Email Verification
    </h2>

    <p style="color:#374151;font-size:16px;">

      Dear Applicant,

    </p>

    <p style="color:#374151;line-height:1.8;">

      Thank you for applying for the
      <strong>Vidya Jyothi Foundation Scholarship.</strong>

      Please use the following One-Time Password (OTP)
      to verify your email address.

    </p>

    <div style="margin:35px 0;text-align:center;">

      <span style="
        display:inline-block;
        background:#2563eb;
        color:white;
        font-size:34px;
        letter-spacing:8px;
        padding:18px 40px;
        border-radius:10px;
        font-weight:bold;
      ">

        ${otp}

      </span>

    </div>

    <p style="color:#374151;">

      ⏳ This OTP is valid for
      <strong>1 minute.</strong>

    </p>

    <p style="color:#dc2626;">

      Never share this OTP with anyone.

    </p>

    <hr style="margin:35px 0;">

    <p style="font-size:13px;color:#6b7280;">

      If you did not request this verification,
      you may safely ignore this email.

    </p>

  </div>

  <div style="background:#f3f4f6;padding:18px;text-align:center;">

    <small style="color:#6b7280;">

      © 2026 Vidya Jyothi Foundation

    </small>

  </div>

</div>
`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    console.log("[emailService] OTP email sent:", {
      to: email,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("[emailService] Failed to send OTP email:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};


/*
|--------------------------------------------------------------------------
| Send Application Status Email
|--------------------------------------------------------------------------
*/

const sendApplicationStatusEmail = async (

  application

) => {

  const {

    email,

    student_name,

    application_id,

    status,

    remarks,

    sanctioned_amount,

  } = application;

  let title = "";

  let message = "";

  switch (status) {

    case "Documents Verified":

      title = "Documents Verified";

      message =
        "Your submitted documents have been verified successfully.";

      break;

    case "Under Review":

      title = "Application Under Review";

      message =
        "Your scholarship application is currently under review.";

      break;

    case "Approved":

      title = "Application Approved";

      message =
        "Congratulations! Your scholarship application has been approved.";

      break;

    case "Rejected":

      title = "Application Rejected";

      message =
        "We regret to inform you that your scholarship application has been rejected.";

      break;

    case "Scholarship Released":

      title = "Scholarship Released";

      message =
        "Your scholarship amount has been released successfully.";

      break;

    default:

      title = "Application Status Updated";

      message =
        "Your scholarship application status has been updated.";

  }

  await transporter.sendMail({

    from: `"Vidya Jyothi Foundation" <${process.env.EMAIL_USER}>`,

    to: email,

    subject: `Vidya Jyothi Foundation - ${title}`,

    html: `

    <div style="max-width:700px;margin:auto;font-family:Arial;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">

      <div style="background:#1d4ed8;padding:25px;text-align:center;">

        <h1 style="margin:0;color:white;">

          Vidya Jyothi Foundation

        </h1>

        <p style="margin-top:8px;color:#dbeafe;">

          Scholarship Management System

        </p>

      </div>

      <div style="padding:35px;">

        <h2 style="margin-top:0;color:#111827;">

          ${title}

        </h2>

        <p>

          Dear

          <strong>${student_name}</strong>,

        </p>

        <p style="line-height:1.8;">

          ${message}

        </p>

        <table style="width:100%;margin-top:25px;border-collapse:collapse;">

          <tr>

            <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">

              Application Number

            </td>

            <td style="padding:10px;border:1px solid #ddd;">

              ${application_id}

            </td>

          </tr>

          <tr>

            <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">

              Current Status

            </td>

            <td style="padding:10px;border:1px solid #ddd;">

              ${status}

            </td>

          </tr>

          ${
            sanctioned_amount
              ? `
          <tr>

            <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">

              Sanctioned Amount

            </td>

            <td style="padding:10px;border:1px solid #ddd;">

              ₹ ${Number(sanctioned_amount).toLocaleString("en-IN")}

            </td>

          </tr>
          `
              : ""
          }

          ${
            remarks
              ? `
          <tr>

            <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">

              Remarks

            </td>

            <td style="padding:10px;border:1px solid #ddd;">

              ${remarks}

            </td>

          </tr>
          `
              : ""
          }

        </table>

        <p style="margin-top:30px;">

          Thank you for choosing

          <strong>Vidya Jyothi Foundation.</strong>

        </p>

      </div>

      <div style="background:#f3f4f6;padding:15px;text-align:center;">

        <small>

          © 2026 Vidya Jyothi Foundation

        </small>

      </div>

    </div>

    `,

  });

};


module.exports = {

  sendOtpEmail,

  sendApplicationStatusEmail,

};