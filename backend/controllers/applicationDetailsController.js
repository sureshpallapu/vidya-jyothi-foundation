const {
  getApplicationDetails,
  getApplicationDocuments,
} = require("../models/applicationDetailsModel");

/*
|--------------------------------------------------------------------------
| Get Single Scholarship Application
|--------------------------------------------------------------------------
*/

const applicationDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await getApplicationDetails(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const uploadedDocuments =
    await getApplicationDocuments(id);

/*
|--------------------------------------------------------------------------
| Convert Array into Object
|--------------------------------------------------------------------------
*/

const documents = {};

uploadedDocuments.forEach((doc) => {

    documents[doc.document_name] = doc;

});

res.status(200).json({

    success: true,

    data: {

        application,

        documents,

    },

});

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch application details.",
    });

  }
};

module.exports = {
  applicationDetails,
};