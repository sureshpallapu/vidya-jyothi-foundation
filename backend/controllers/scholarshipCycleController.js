const {
  getScholarshipCycles,
  getScholarshipCycleById,
  createScholarshipCycle,
  updateScholarshipCycle,
  activateScholarshipCycle,
  deleteScholarshipCycle,
} = require("../models/scholarshipCycleModel");

/*
|--------------------------------------------------------------------------
| Get All Scholarship Cycles
|--------------------------------------------------------------------------
*/

const cyclesList = async (req, res) => {

  try {

    const cycles =
      await getScholarshipCycles();

    res.status(200).json({
      success: true,
      data: cycles,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch scholarship cycles.",
    });

  }

};

/*
|--------------------------------------------------------------------------
| Get Single Scholarship Cycle
|--------------------------------------------------------------------------
*/

const cycleDetails = async (req, res) => {

  try {

    const { id } = req.params;

    const cycle =
      await getScholarshipCycleById(id);

    if (!cycle) {

      return res.status(404).json({
        success: false,
        message: "Scholarship cycle not found.",
      });

    }

    res.status(200).json({
      success: true,
      data: cycle,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch scholarship cycle.",
    });

  }

};

/*
|--------------------------------------------------------------------------
| Create Scholarship Cycle
|--------------------------------------------------------------------------
*/

const createCycle = async (req, res) => {

  try {

    const {
      scholarship_year,
      title,
      is_active,
      start_date,
      end_date,
    } = req.body;

    if (
      !scholarship_year ||
      !title ||
      !start_date ||
      !end_date
    ) {

      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });

    }

    await createScholarshipCycle({
      scholarship_year,
      title,
      is_active: is_active || 0,
      start_date,
      end_date,
    });

    res.status(201).json({
      success: true,
      message: "Scholarship cycle created successfully.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create scholarship cycle.",
    });

  }

};

/*
|--------------------------------------------------------------------------
| Update Scholarship Cycle
|--------------------------------------------------------------------------
*/

const updateCycle = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      scholarship_year,
      title,
      is_active,
      start_date,
      end_date,
    } = req.body;

    const cycle =
      await getScholarshipCycleById(id);

    if (!cycle) {

      return res.status(404).json({
        success: false,
        message: "Scholarship cycle not found.",
      });

    }

    await updateScholarshipCycle(id, {
      scholarship_year,
      title,
      is_active,
      start_date,
      end_date,
    });

    res.status(200).json({
      success: true,
      message: "Scholarship cycle updated successfully.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update scholarship cycle.",
    });

  }

};

/*
|--------------------------------------------------------------------------
| Activate Scholarship Cycle
|--------------------------------------------------------------------------
*/

const activateCycle = async (req, res) => {

  try {

    const { id } = req.params;

    const cycle =
      await getScholarshipCycleById(id);

    if (!cycle) {

      return res.status(404).json({
        success: false,
        message: "Scholarship cycle not found.",
      });

    }

    await activateScholarshipCycle(id);

    res.status(200).json({
      success: true,
      message: "Scholarship cycle activated successfully.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to activate scholarship cycle.",
    });

  }

};

/*
|--------------------------------------------------------------------------
| Delete Scholarship Cycle
|--------------------------------------------------------------------------
*/

const deleteCycle = async (req, res) => {

  try {

    const { id } = req.params;

    const cycle =
      await getScholarshipCycleById(id);

    if (!cycle) {

      return res.status(404).json({
        success: false,
        message: "Scholarship cycle not found.",
      });

    }

    await deleteScholarshipCycle(id);

    res.status(200).json({
      success: true,
      message: "Scholarship cycle deleted successfully.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete scholarship cycle.",
    });

  }

};

module.exports = {
  cyclesList,
  cycleDetails,
  createCycle,
  updateCycle,
  activateCycle,
  deleteCycle,
};