const bcrypt = require("bcrypt");

const {

  getAllAdmins,
  getAdminById,
  getAdminByUsername,
  createAdmin,
  updateAdmin,
  updateAdminStatus,
  resetAdminPassword,
  deleteAdmin,

} = require("../models/adminManagementModel");


/*
|--------------------------------------------------------------------------
| Get All Administrators
|--------------------------------------------------------------------------
*/

const getAdmins = async (req, res) => {

  try {

    const admins =
      await getAllAdmins();

    return res.json({

      success: true,

      data: admins,

    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch administrators.",

    });

  }

};

/*
|--------------------------------------------------------------------------
| Get Administrator By ID
|--------------------------------------------------------------------------
*/

const getAdmin = async (req, res) => {

  try {

    const admin =
      await getAdminById(
        req.params.id
      );

    if (!admin) {

      return res.status(404).json({

        success: false,

        message:
          "Administrator not found.",

      });

    }

    return res.json({

      success: true,

      data: admin,

    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch administrator.",

    });

  }

};

/*
|--------------------------------------------------------------------------
| Create Administrator
|--------------------------------------------------------------------------
*/

const createAdministrator = async (req, res) => {

  try {

    const {

      username,
      full_name,
      email,
      mobile,
      role,
      status,
      password,

    } = req.body;

    if (

      !username ||

      !full_name ||

      !password ||

      !role

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Required fields are missing.",

      });

    }

    const exists =
      await getAdminByUsername(
        username
      );

    if (exists) {

      return res.status(400).json({

        success: false,

        message:
          "Username already exists.",

      });

    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    await createAdmin({

      username,

      full_name,

      email,

      mobile,

      role,

      status,

      password:
        hashedPassword,

    });

    return res.status(201).json({

      success: true,

      message:
        "Administrator created successfully.",

    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to create administrator.",

    });

  }

};

/*
|--------------------------------------------------------------------------
| Update Administrator
|--------------------------------------------------------------------------
*/

const updateAdministrator = async (req, res) => {

  try {

    const admin = await getAdminById(req.params.id);

    if (!admin) {

      return res.status(404).json({
        success: false,
        message: "Administrator not found.",
      });

    }

    await updateAdmin(req.params.id, req.body);

    return res.json({
      success: true,
      message: "Administrator updated successfully.",
    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update administrator.",
    });

  }

};

/*
|--------------------------------------------------------------------------
| Update Administrator Status
|--------------------------------------------------------------------------
*/

const changeAdministratorStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const admin =
      await getAdminById(req.params.id);

    if (!admin) {

      return res.status(404).json({
        success: false,
        message: "Administrator not found.",
      });

    }

    if (
      admin.role === "SUPER_ADMIN"
    ) {

      return res.status(403).json({
        success: false,
        message:
          "Super Admin status cannot be changed.",
      });

    }

    await updateAdminStatus(
      req.params.id,
      status
    );

    return res.json({
      success: true,
      message:
        "Administrator status updated successfully.",
    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to update status.",
    });

  }

};

/*
|--------------------------------------------------------------------------
| Reset Administrator Password
|--------------------------------------------------------------------------
*/

const resetAdministratorPassword = async (req, res) => {

  try {

    const { password } = req.body;

    if (!password) {

      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });

    }

    const admin =
      await getAdminById(req.params.id);

    if (!admin) {

      return res.status(404).json({
        success: false,
        message: "Administrator not found.",
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await resetAdminPassword(
      req.params.id,
      hashedPassword
    );

    return res.json({
      success: true,
      message:
        "Password reset successfully.",
    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to reset password.",
    });

  }

};

/*
|--------------------------------------------------------------------------
| Delete Administrator
|--------------------------------------------------------------------------
*/

const deleteAdministrator = async (req, res) => {

  try {

    const admin =
      await getAdminById(req.params.id);

    if (!admin) {

      return res.status(404).json({
        success: false,
        message: "Administrator not found.",
      });

    }

    if (
      admin.role === "SUPER_ADMIN" ||
      admin.role === "FOUNDER"
    ) {

      return res.status(403).json({
        success: false,
        message:
          "This administrator cannot be deleted.",
      });

    }

    await deleteAdmin(req.params.id);

    return res.json({
      success: true,
      message:
        "Administrator deleted successfully.",
    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete administrator.",
    });

  }

};

module.exports = {

  getAdmins,

  getAdmin,

  createAdministrator,

  updateAdministrator,

  changeAdministratorStatus,

  resetAdministratorPassword,

  deleteAdministrator,

};