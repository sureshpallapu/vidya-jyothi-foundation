const {
  getSettings,
  updateSettings,
} = require("../models/settingsModel");

/*
|--------------------------------------------------------------------------
| Get Settings
|--------------------------------------------------------------------------
*/

const fetchSettings = async (req, res) => {

  try {

    const settings = await getSettings();

    return res.status(200).json({

      success: true,

      data: settings,

    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: "Failed to fetch settings.",

    });

  }

};

/*
|--------------------------------------------------------------------------
| Update Settings
|--------------------------------------------------------------------------
*/

const saveSettings = async (req, res) => {

  try {

    const {

      trust_name,

      trust_address,

      trust_email,

      trust_phone,

      trust_website,

      founder_name,

      founder_designation,

      founder_message,

      application_prefix,

      session_timeout,

    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Basic Validation
    |--------------------------------------------------------------------------
    */

    if (!trust_name || trust_name.trim() === "") {

      return res.status(400).json({

        success: false,

        message: "Trust Name is required.",

      });

    }

    if (!application_prefix || application_prefix.trim() === "") {

      return res.status(400).json({

        success: false,

        message: "Application Prefix is required.",

      });

    }

    if (!session_timeout || Number(session_timeout) <= 0) {

      return res.status(400).json({

        success: false,

        message: "Session Timeout must be greater than 0.",

      });

    }

    await updateSettings({

      trust_name,

      trust_address,

      trust_email,

      trust_phone,

      trust_website,

      founder_name,

      founder_designation,

      founder_message,

      application_prefix,

      session_timeout,

    });

    return res.status(200).json({

      success: true,

      message: "Settings updated successfully.",

    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: "Failed to update settings.",

    });

  }

};

module.exports = {

  fetchSettings,

  saveSettings,

};