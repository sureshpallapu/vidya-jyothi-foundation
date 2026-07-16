import axios from "axios";

const API_URL =
  "http://localhost:5000/api/scholarship";

/*
|--------------------------------------------------------------------------
| Check Aadhaar Duplicate
|--------------------------------------------------------------------------
*/

export const checkAadhaarDuplicate = (aadhaar) => {

  return axios.get(

    `${API_URL}/check-aadhaar/${aadhaar}`

  );

};