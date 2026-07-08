const {
  getAdminByUsername,
} = require("../models/adminModel");

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

    // If passwords are stored as plain text, temporarily use:
    // const passwordMatch = password === admin.password;

  const passwordMatch = password === admin.password;

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