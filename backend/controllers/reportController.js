const {
  getApplicationReport,
} = require("../models/reportModel");

/*
|--------------------------------------------------------------------------
| Application Report
|--------------------------------------------------------------------------
*/

const applicationReport = async (req, res) => {

  try {

    const {

      status,

      district,

      gender,

    } = req.query;

    const data =
      await getApplicationReport({

        status,

        district,

        gender,

      });

    return res.status(200).json({

      success: true,

      data,

    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to generate report.",

    });

  }

};

module.exports = {

  applicationReport,

};