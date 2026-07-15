const {
  getDashboardStatistics,
} = require("../models/dashboardModel");

/*
|--------------------------------------------------------------------------
| Dashboard Analytics
|--------------------------------------------------------------------------
*/

const getDashboardAnalytics = async (req, res) => {

  try {

    const statistics =
      await getDashboardStatistics();

    return res.status(200).json({

      success: true,

      data: statistics,

    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to load dashboard analytics.",

    });

  }

};

module.exports = {

  getDashboardAnalytics,

};