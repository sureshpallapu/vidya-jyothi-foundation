/**
 * ============================================================================
 * VIDYA JYOTHI FOUNDATION
 * Automation Service
 * ============================================================================
 *
 * Responsible for:
 *
 * Business Event
 *      ↓
 * Automation Rule
 *      ↓
 * Notification
 *
 * Examples:
 *
 * VOLUNTEER_ACTIVATED
 * VOLUNTEER_SUSPENDED
 * EVENT_CREATED
 * EVENT_REMINDER
 * CERTIFICATE_GENERATED
 * ============================================================================
 */

const notificationService = require("./notificationService");

const automationService = {
  /**
   * Process a business event.
   *
   * Rules will come from the database later.
   */
  async processEvent({
    eventType,
    entityType,
    entityId,
    data = {},
  }) {
    if (!eventType) {
      throw new Error("Event type is required.");
    }

    console.log(
      "=============================================="
    );

    console.log(
      "AUTOMATION EVENT"
    );

    console.log(
      "=============================================="
    );

    console.log({
      eventType,
      entityType,
      entityId,
      data,
    });

    /*
     * Database-driven automation rules
     * will be connected here later.
     */

    return {
      success: true,
      eventType,
      processed: true,
    };
  },

  /**
   * Future helper.
   */
  async triggerVolunteerEvent({
    eventType,
    volunteerId,
    data = {},
  }) {
    return this.processEvent({
      eventType,
      entityType: "VOLUNTEER",
      entityId: volunteerId,
      data,
    });
  },

  /**
   * Future helper.
   */
  async triggerEvent({
    eventType,
    eventId,
    data = {},
  }) {
    return this.processEvent({
      eventType,
      entityType: "EVENT",
      entityId: eventId,
      data,
    });
  },

  /**
   * Future helper.
   */
  async triggerActivityEvent({
    eventType,
    activityId,
    data = {},
  }) {
    return this.processEvent({
      eventType,
      entityType: "ACTIVITY",
      entityId: activityId,
      data,
    });
  },
};

module.exports = automationService;