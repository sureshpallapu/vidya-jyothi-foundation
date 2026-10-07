const express = require("express");

const router = express.Router();

const activityUpload = require("../middleware/activityUpload");

const {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity,
} = require("../controllers/activityController");

/*
|--------------------------------------------------------------------------
| ACTIVITY ROUTES
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| CREATE ACTIVITY
|--------------------------------------------------------------------------
| POST /api/activities
|
| multipart/form-data
| field:
| cover_image
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  activityUpload.single("cover_image"),
  createActivity
);


/*
|--------------------------------------------------------------------------
| GET ACTIVITIES
|--------------------------------------------------------------------------
| GET /api/activities
|--------------------------------------------------------------------------
*/

router.get("/", getActivities);


/*
|--------------------------------------------------------------------------
| GET SINGLE ACTIVITY
|--------------------------------------------------------------------------
| GET /api/activities/:activityId
|--------------------------------------------------------------------------
*/

router.get("/:activityId", getActivity);


/*
|--------------------------------------------------------------------------
| UPDATE ACTIVITY
|--------------------------------------------------------------------------
| PUT /api/activities/:activityId
|--------------------------------------------------------------------------
*/

router.put(
  "/:activityId",
  activityUpload.single("cover_image"),
  updateActivity
);


/*
|--------------------------------------------------------------------------
| DELETE / ARCHIVE ACTIVITY
|--------------------------------------------------------------------------
| DELETE /api/activities/:activityId
|--------------------------------------------------------------------------
*/

router.delete(
  "/:activityId",
  deleteActivity
);


module.exports = router;