import axios from "axios";

const API_URL = "http://localhost:5000/api/ifsc";

/*
|--------------------------------------------------------------------------
| Get Bank Details
|--------------------------------------------------------------------------
*/

export const getBankByIfsc = (ifsc) => {

  return axios.get(

    `${API_URL}/${ifsc}`

  );

};