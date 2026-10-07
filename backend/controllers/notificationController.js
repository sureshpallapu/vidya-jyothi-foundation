const notificationService = require("../services/notificationService");
const automationService = require("../services/automationService");

/**
 * Test notification creation.
 *
 * This does NOT send WhatsApp/SMS/email.
 */
const createNotification = async (req, res) => {
  try {
    const result =
      await notificationService.createNotification(
        req.body
      );

    return res.status(201).json({
      success: true,
      message: "Notification created successfully.",
      data: result.notification,
    });

  } catch (error) {
    console.error(
      "CREATE NOTIFICATION ERROR:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
      errors: [],
    });
  }
};


/**
 * Test business automation event.
 *
 * This is our foundation endpoint.
 */
const triggerAutomationEvent = async (req, res) => {
  try {
    const {
      eventType,
      entityType,
      entityId,
      data,
    } = req.body;

    const result =
      await automationService.processEvent({
        eventType,
        entityType,
        entityId,
        data,
      });

    return res.status(200).json({
      success: true,
      message: "Automation event processed successfully.",
      data: result,
    });

  } catch (error) {
    console.error(
      "AUTOMATION EVENT ERROR:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
      errors: [],
    });
  }
};


module.exports = {
  createNotification,
  triggerAutomationEvent,
};