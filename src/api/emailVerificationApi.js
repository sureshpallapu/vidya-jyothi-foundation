import axios from "axios";

const API =
  "http://localhost:5000/api/email";

/*
|--------------------------------------------------------------------------
| Send OTP
|--------------------------------------------------------------------------
*/

export const sendOtp = (email) => {

  return axios.post(

    `${API}/send-otp`,

    {

      email,

    }

  );

};

/*
|--------------------------------------------------------------------------
| Verify OTP
|--------------------------------------------------------------------------
*/

export const verifyOtp = (

  email,

  otp

) => {

  return axios.post(

    `${API}/verify-otp`,

    {

      email,

      otp,

    }

  );

};