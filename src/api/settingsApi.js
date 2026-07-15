import axios from "axios";

const API = "http://localhost:5000/api/settings";

/*
|--------------------------------------------------------------------------
| Get Settings
|--------------------------------------------------------------------------
*/

export const getSettings = () => {

  return axios.get(API);

};

/*
|--------------------------------------------------------------------------
| Update Settings
|--------------------------------------------------------------------------
*/

export const updateSettings = (data) => {

  return axios.put(

    API,

    data

  );

};