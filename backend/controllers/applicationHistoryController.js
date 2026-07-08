const {
  getApplicationHistory,
} = require("../models/applicationHistoryModel");

const applicationHistory =
async (req, res) => {

  try {

    const { id } = req.params;

    const history =
      await getApplicationHistory(id);

    res.json({

      success: true,

      data: history,

    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
      "Failed to load history.",

    });

  }

};

module.exports = {
  applicationHistory,
};