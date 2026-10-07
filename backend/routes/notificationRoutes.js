const express = require("express");

const router = express.Router();

const {
  createNotification,
  triggerAutomationEvent,
} = require("../controllers/notificationController");


/*
|--------------------------------------------------------------------------
| NOTIFICATION FOUNDATION
|--------------------------------------------------------------------------
*/

/*
POST
/api/notifications
*/

router.post(
  "/",
  createNotification
);


/*
|--------------------------------------------------------------------------
| AUTOMATION FOUNDATION
|--------------------------------------------------------------------------
*/

/*
POST
/api/notifications/automation/event
*/

router.post(
  "/automation/event",
  triggerAutomationEvent
);


module.exports = router;