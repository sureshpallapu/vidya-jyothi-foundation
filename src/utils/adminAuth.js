/*
|--------------------------------------------------------------------------
| Admin Authentication Helper
|--------------------------------------------------------------------------
*/

const ADMIN_KEY = "admin";
const LOGIN_KEY = "adminLoggedIn";
const LOGIN_TIME = "loginTime";
const LAST_ACTIVITY = "lastActivity";
const SESSION_TIMEOUT_KEY = "sessionTimeout";

// Default session timeout, in minutes. All timeout values stored in
// localStorage are treated as raw minutes (not milliseconds) throughout
// this file, so keep this consistent with that unit.
const DEFAULT_TIMEOUT_MINUTES = 5;

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export const login = (admin, sessionTimeout = DEFAULT_TIMEOUT_MINUTES) => {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
  localStorage.setItem(LOGIN_KEY, "true");

  const now = Date.now();

  localStorage.setItem(LOGIN_TIME, now.toString());
  localStorage.setItem(LAST_ACTIVITY, now.toString());
  localStorage.setItem(SESSION_TIMEOUT_KEY, String(sessionTimeout));
};

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
  window.history.pushState(null, "", window.location.href);
};

/*
|--------------------------------------------------------------------------
| Logged In Admin
|--------------------------------------------------------------------------
*/

export const getAdmin = () => {
  const admin = localStorage.getItem(ADMIN_KEY);
  return admin ? JSON.parse(admin) : null;
};

/*
|--------------------------------------------------------------------------
| Authentication Check
|--------------------------------------------------------------------------
*/

export const isAuthenticated = () => {
  const loggedIn = localStorage.getItem(LOGIN_KEY);
  const admin = localStorage.getItem(ADMIN_KEY);
  const lastActivity = Number(localStorage.getItem(LAST_ACTIVITY));

  if (!loggedIn || !admin || !lastActivity) {
    return false;
  }

  const now = Date.now();
  const timeout =
    Number(localStorage.getItem(SESSION_TIMEOUT_KEY)) ||
    DEFAULT_TIMEOUT_MINUTES;

  if (now - lastActivity > timeout * 60 * 1000) {
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
  localStorage.setItem(LAST_ACTIVITY, Date.now().toString());
};

/*
|--------------------------------------------------------------------------
| Last Activity
|--------------------------------------------------------------------------
*/

export const getLastActivity = () => {
  return Number(localStorage.getItem(LAST_ACTIVITY));
};

/*
|--------------------------------------------------------------------------
| Session Timeout
|--------------------------------------------------------------------------
*/

export const getSessionTimeout = () => {
  return (
    (Number(localStorage.getItem(SESSION_TIMEOUT_KEY)) ||
      DEFAULT_TIMEOUT_MINUTES) *
    60 *
    1000
  );
};