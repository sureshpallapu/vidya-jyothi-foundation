const bcrypt = require("bcrypt");

const { getAdminByUsername } = require("../models/adminModel");

/*
|--------------------------------------------------------------------------
| Admin Login
|--------------------------------------------------------------------------
*/

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and Password are required.",
      });
    }

    const admin = await getAdminByUsername(username);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid Username or Password.",
      });
    }

    if (admin.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

    // Passwords are stored as bcrypt hashes (see adminManagementController's
    // createAdministrator / resetAdministratorPassword), so they must be
    // compared with bcrypt.compare — a plain `===` check will always fail
    // against a hash, which is what was causing every login to 401.
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Username or Password.",
      });
    }

    return res.json({
      success: true,
      message: "Login Successful.",
      admin: {
        id: admin.id,
        username: admin.username,
        fullName: admin.full_name,
        email: admin.email,
        mobile: admin.mobile,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Login Failed.",
    });
  }
};

module.exports = {
  login,
};