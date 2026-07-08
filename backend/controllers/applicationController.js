const {
  getDashboardStats,
  getApplications,
} = require("../models/applicationModel");
/**
 * Dashboard Statistics
 */
const dashboardStatistics = async (req, res) => {
  try {
    const stats = await getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


/**
 * Applications List
 */
const applicationsList = async (req, res) => {
  try {

    const applications =
      await getApplications();

    res.status(200).json({
      success: true,
      total: applications.length,
      data: applications,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


module.exports = {
  dashboardStatistics,
  applicationsList,
};