import axios from "axios";

const API =
  "http://localhost:5000/api/dashboard";

/*
|--------------------------------------------------------------------------
| Dashboard Analytics
|--------------------------------------------------------------------------
*/

export const getDashboardAnalytics =
  () => {

    return axios.get(

      `${API}/analytics`

    );

  };