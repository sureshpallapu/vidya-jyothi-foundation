import { useState, useEffect } from "react";
import {
  FaUser,
  FaUserFriends,
  FaCalendarAlt,
  FaVenusMars,
  FaPhoneAlt,
  FaEnvelope,
  FaIdCard,
  FaPaperPlane,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";
import { sendOtp, verifyOtp } from "../../api/emailVerificationApi";

import { checkAadhaarDuplicate } from "../../api/aadhaarApi";
import { toTitleCase } from "../../utils/textFormatter";


/* ==========================================================================
   Shared field styling helpers
   ========================================================================== */

const fieldLabelClass =
  "flex items-center gap-2 mb-2 font-medium text-slate-700";

const fieldInputClass = (hasError) =>
  `w-full rounded-xl px-4 py-3 border outline-none transition ${
    hasError
      ? "border-red-400 focus:ring-2 focus:ring-red-400"
      : "border-gray-200 focus:ring-2 focus:ring-yellow-500"
  }`;

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-red-500 text-sm mt-1.5">{message}</p>;
}

function PersonalDetails({ formData, setFormData, errors }) {
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
const [checkingAadhaar, setCheckingAadhaar] =
  useState(false);

const [aadhaarDuplicate, setAadhaarDuplicate] =
  useState(null);


  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

if (name === "aadhaar") {

  updatedValue = value.replace(/\D/g, "");

}

   setFormData((prev) => ({

  ...prev,

  [name]: updatedValue,

}));

if (

  name === "aadhaar" &&

  updatedValue.length === 12

) {

  handleAadhaarCheck(
    updatedValue
  );

}

else if (name === "aadhaar") {

  setAadhaarDuplicate(null);

}
  };


  const handleBlur = (e) => {

  const { name, value } = e.target;

  if (

    [

      "studentName",

      "fatherName",

      "motherName",

    ].includes(name)

  ) {

    setFormData((prev) => ({

      ...prev,

      [name]: toTitleCase(value),

    }));

  }

};
  /*
  |--------------------------------------------------------------------------
  | Send OTP
  |--------------------------------------------------------------------------
  */
  const handleSendOtp = async () => {
    if (!formData.email) {
      alert("Please enter your email.");
      return;
    }

    try {
      setSendingOtp(true);

      await sendOtp(formData.email);

      setShowOtpBox(true);
      setCountdown(60);
      setCanResend(false);
      alert("OTP has been sent to your email.");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Verify OTP
  |--------------------------------------------------------------------------
  */
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      setVerifyingOtp(true);
      await verifyOtp(formData.email, otp);
      setFormData((prev) => ({
        ...prev,
        emailVerified: true,
      }));
      setShowOtpBox(false);
      setOtp("");
      alert("Email verified successfully.");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP.");
    } finally {
      setVerifyingOtp(false);
    }
  };


  /*
|--------------------------------------------------------------------------
| Check Aadhaar Duplicate
|--------------------------------------------------------------------------
*/

const handleAadhaarCheck = async (
  aadhaar
) => {

  if (aadhaar.length !== 12) {

    setAadhaarDuplicate(null);

    return;

  }

  try {

    setCheckingAadhaar(true);

    const response =
      await checkAadhaarDuplicate(
        aadhaar
      );

    if (response.data.exists) {

      setAadhaarDuplicate(
        response.data
      );

    }

    else {

      setAadhaarDuplicate(null);

    }

  }

  catch (error) {

    console.error(error);

    setAadhaarDuplicate(null);

  }

  finally {

    setCheckingAadhaar(false);

  }

};
  /*
  |--------------------------------------------------------------------------
  | Countdown Timer
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    let timer;

    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">
          Personal Details
        </h2>
        <p className="text-slate-500 mt-1.5">
          Tell us a bit about yourself so we can process your application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Name */}
        <div>
          <label className={fieldLabelClass}>
            <FaUser className="text-yellow-500 text-sm" />
            Student Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter Student Name"
            className={fieldInputClass(errors.studentName)}
          />

          <FieldError message={errors.studentName} />
        </div>

        {/* Father Name */}
        <div>
          <label className={fieldLabelClass}>
            <FaUserFriends className="text-yellow-500 text-sm" />
            Father Name
          </label>

          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter Father Name"
            className={fieldInputClass(false)}
          />
        </div>

        {/* Mother Name */}
        <div>
          <label className={fieldLabelClass}>
            <FaUserFriends className="text-yellow-500 text-sm" />
            Mother Name
          </label>

          <input
            type="text"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter Mother Name"
            className={fieldInputClass(false)}
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className={fieldLabelClass}>
            <FaCalendarAlt className="text-yellow-500 text-sm" />
            Date of Birth
          </label>

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            onBlur={handleBlur}
            className={fieldInputClass(false)}
          />
        </div>

        {/* Gender */}
        <div>
          <label className={fieldLabelClass}>
            <FaVenusMars className="text-yellow-500 text-sm" />
            Gender
          </label>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={fieldInputClass(false)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Mobile */}
        <div>
          <label className={fieldLabelClass}>
            <FaPhoneAlt className="text-yellow-500 text-sm" />
            Mobile Number <span className="text-red-500">*</span>
          </label>

          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter Mobile Number"
            maxLength={10}
            className={fieldInputClass(errors.mobile)}
          />

          <FieldError message={errors.mobile} />
        </div>

        {/* Email + OTP Verification */}
        <div className="md:col-span-2">
          <label className={fieldLabelClass}>
            <FaEnvelope className="text-yellow-500 text-sm" />
            Email Address <span className="text-red-500">*</span>
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={formData.emailVerified}
              placeholder="Enter Email Address"
              className={`flex-1 ${fieldInputClass(errors.email)} ${
                formData.emailVerified ? "bg-gray-50 text-gray-500" : ""
              }`}
            />

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sendingOtp || formData.emailVerified}
              className="
                flex items-center justify-center gap-2
                bg-blue-600 hover:bg-blue-700
                disabled:bg-gray-300 disabled:cursor-not-allowed
                text-white font-medium
                px-6 py-3 rounded-xl
                transition whitespace-nowrap
              "
            >
              {sendingOtp ? (
                "Sending..."
              ) : formData.emailVerified ? (
                <>
                  <FaCheckCircle /> Verified
                </>
              ) : (
                <>
                  <FaPaperPlane className="text-sm" /> Send OTP
                </>
              )}
            </button>
          </div>

          <FieldError message={errors.email} />

          {/* OTP entry panel */}
          {showOtpBox && !formData.emailVerified && (
            <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-5">
              <p className="flex items-center gap-2 text-blue-700 font-medium">
                <FaShieldAlt className="shrink-0" />
                We've sent a verification code to{" "}
                <strong>{formData.email}</strong>
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 tracking-widest"
                />

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={verifyingOtp}
                  className="
                    bg-green-600 hover:bg-green-700
                    disabled:bg-gray-300 disabled:cursor-not-allowed
                    text-white font-medium
                    px-6 py-3 rounded-xl
                    transition whitespace-nowrap
                  "
                >
                  {verifyingOtp ? "Verifying..." : "Verify OTP"}
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                {countdown > 0 ? (
                  <span className="text-sm text-gray-600">
                    Resend OTP in <strong>{countdown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!canResend || sendingOtp}
                    className="text-blue-600 hover:underline font-medium disabled:text-gray-400 disabled:no-underline"
                  >
                    {sendingOtp ? "Resending..." : "Resend OTP"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Verified success state */}
          {formData.emailVerified && (
            <div className="mt-5 rounded-xl border border-green-300 bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-full bg-green-600 text-white flex items-center justify-center">
                  <FaCheckCircle />
                </div>
                <div>
                  <p className="font-semibold text-green-700">
                    Email Verified Successfully
                  </p>
                  <p className="text-sm text-green-600">
                    Your email has been verified.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Aadhaar */}
        <div>
          <label className={fieldLabelClass}>
            <FaIdCard className="text-yellow-500 text-sm" />
            Aadhaar Number <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="aadhaar"
            value={formData.aadhaar}
            onChange={handleChange}
            placeholder="Enter 12-digit Aadhaar Number"
            maxLength={12}
            className={fieldInputClass(errors.aadhaar)}
          />


{checkingAadhaar && (

  <p className="text-blue-600 text-sm mt-2">

    Checking Aadhaar...

  </p>

)}

{aadhaarDuplicate && (

  <div className="mt-3 rounded-lg border border-red-300 bg-red-50 p-4">

    <p className="font-semibold text-red-700">

      ❌ An application already exists.

    </p>

    <p className="text-sm mt-2">

      <strong>Application Number:</strong>{" "}

      {aadhaarDuplicate.applicationNumber}

    </p>

    <p className="text-sm">

      <strong>Student Name:</strong>{" "}

      {aadhaarDuplicate.studentName}

    </p>

    <p className="text-sm">

      <strong>Status:</strong>{" "}

      {aadhaarDuplicate.status}

    </p>

    <p className="mt-3 text-sm text-gray-700">

      Please use the

      <strong>

        {" "}Application Status{" "}

      </strong>

      page to track your application.

    </p>

  </div>

)}
          <FieldError message={errors.aadhaar} />
        </div>
      </div>
    </div>
  );
}

export default PersonalDetails;