import axios from "axios";

/*
|--------------------------------------------------------------------------
| API Base URL
|--------------------------------------------------------------------------
*/

const API =
  "http://localhost:5000/api/admin";

/*
|--------------------------------------------------------------------------
| Get All Administrators
|--------------------------------------------------------------------------
*/

export const getAdmins = () => {

  return axios.get(
    `${API}/admins`
  );

};

/*
|--------------------------------------------------------------------------
| Get Administrator By ID
|--------------------------------------------------------------------------
*/

export const getAdmin = (id) => {

  return axios.get(
    `${API}/admins/${id}`
  );

};

/*
|--------------------------------------------------------------------------
| Create Administrator
|--------------------------------------------------------------------------
*/

export const createAdmin = (data) => {

  return axios.post(
    `${API}/admins`,
    data
  );

};

/*
|--------------------------------------------------------------------------
| Update Administrator
|--------------------------------------------------------------------------
*/

export const updateAdmin = (
  id,
  data
) => {

  return axios.put(
    `${API}/admins/${id}`,
    data
  );

};

/*
|--------------------------------------------------------------------------
| Update Administrator Status
|--------------------------------------------------------------------------
*/

export const updateAdminStatus = (
  id,
  status
) => {

  return axios.put(
    `${API}/admins/${id}/status`,
    {
      status,
    }
  );

};

/*
|--------------------------------------------------------------------------
| Reset Administrator Password
|--------------------------------------------------------------------------
*/

export const resetAdminPassword = (
  id,
  password
) => {

  return axios.put(
    `${API}/admins/${id}/password`,
    {
      password,
    }
  );

};

/*
|--------------------------------------------------------------------------
| Delete Administrator
|--------------------------------------------------------------------------
*/

export const deleteAdmin = (id) => {

  return axios.delete(
    `${API}/admins/${id}`
  );

};