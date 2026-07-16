import axios from "axios";

const API_URL = "http://localhost:5000/api/pincode";

/*
|--------------------------------------------------------------------------
| Get Location By PIN Code
|--------------------------------------------------------------------------
*/

export const getLocationByPincode = (pincode) => {

  return axios.get(

    `${API_URL}/${pincode}`

  );

};