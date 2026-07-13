/*
|--------------------------------------------------------------------------
| Admin Authentication Helper
|--------------------------------------------------------------------------
*/

const ADMIN_KEY = "admin";

const LOGIN_KEY = "adminLoggedIn";

const LOGIN_TIME = "loginTime";

const LAST_ACTIVITY = "lastActivity";
const SESSION_TIMEOUT = 5 * 60 * 1000;
/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export const login = (admin) => {

  localStorage.setItem(
    ADMIN_KEY,
    JSON.stringify(admin)
  );

  localStorage.setItem(
    LOGIN_KEY,
    "true"
  );

  const now = Date.now();

  localStorage.setItem(
    LOGIN_TIME,
    now.toString()
  );

  localStorage.setItem(
    LAST_ACTIVITY,
    now.toString()
  );

};

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export const logout = () => {

  localStorage.removeItem(ADMIN_KEY);

  localStorage.removeItem(LOGIN_KEY);

  localStorage.removeItem(LOGIN_TIME);

  localStorage.removeItem(LAST_ACTIVITY);

  sessionStorage.clear();

  /*
  |--------------------------------------------------------------------------
  | Prevent Browser Cache
  |--------------------------------------------------------------------------
  */

  window.history.pushState(
    null,
    "",
    window.location.href
  );

};
/*
|--------------------------------------------------------------------------
| Logged In Admin
|--------------------------------------------------------------------------
*/

export const getAdmin = () => {

  const admin =
    localStorage.getItem(ADMIN_KEY);

  return admin
    ? JSON.parse(admin)
    : null;

};

/*
|--------------------------------------------------------------------------
| Authentication Check
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Authentication Check
|--------------------------------------------------------------------------
*/

export const isAuthenticated = () => {

  const loggedIn =
    localStorage.getItem(LOGIN_KEY);

  const admin =
    localStorage.getItem(ADMIN_KEY);

  const lastActivity =
    Number(
      localStorage.getItem(LAST_ACTIVITY)
    );

  if (
    !loggedIn ||
    !admin ||
    !lastActivity
  ) {

    return false;

  }

  const now = Date.now();

  if (
    now - lastActivity >
    SESSION_TIMEOUT
  ) {

    logout();

    return false;

  }

  return true;

};
/*
|--------------------------------------------------------------------------
| Update Activity
|--------------------------------------------------------------------------
*/

export const updateActivity = () => {

  localStorage.setItem(

    LAST_ACTIVITY,

    Date.now().toString()

  );

};

/*
|--------------------------------------------------------------------------
| Last Activity
|--------------------------------------------------------------------------
*/

export const getLastActivity = () => {

  return Number(

    localStorage.getItem(LAST_ACTIVITY)

  );

};

/*
|--------------------------------------------------------------------------
| Session Timeout
|--------------------------------------------------------------------------
*/

export const getSessionTimeout = () => {

  return SESSION_TIMEOUT;

};