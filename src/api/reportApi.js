import axios from "axios";

const API =
  "http://localhost:5000/api/reports";

/*
|--------------------------------------------------------------------------
| Application Report
|--------------------------------------------------------------------------
*/

export const getApplicationReport =
  (filters = {}) => {

    return axios.get(

      `${API}/applications`,

      {

        params: filters,

      }

    );

  };