/**
 * ============================================================================
 * VIDYA JYOTHI FOUNDATION
 * Notification Service
 * ============================================================================
 *
 * Central service for future communication channels:
 *
 * WhatsApp
 * Email
 * SMS
 *
 * IMPORTANT:
 * This service does NOT directly depend on any existing module.
 *
 * Existing modules can later call this service through business events.
 * ============================================================================
 */

const notificationService = {
  /**
   * Create a notification request.
   *
   * This is intentionally a foundation method for now.
   * Actual provider integration will be added later.
   */
  async createNotification({
    eventType,
    recipientType,
    recipientId,
    channel,
    templateCode,
    variables = {},
    scheduledAt = null,
  }) {
    if (!eventType) {
      throw new Error("Event type is required.");
    }

    if (!recipientType) {
      throw new Error("Recipient type is required.");
    }

    if (!channel) {
      throw new Error("Notification channel is required.");
    }

    return {
      success: true,

      notification: {
        eventType,
        recipientType,
        recipientId: recipientId || null,
        channel,
        templateCode: templateCode || null,
        variables,
        scheduledAt,
        status: scheduledAt ? "SCHEDULED" : "QUEUED",
      },
    };
  },

  /**
   * Future:
   *
   * WhatsApp provider
   */
  async sendWhatsApp() {
    throw new Error(
      "WhatsApp provider is not configured yet."
    );
  },

  /**
   * Future:
   *
   * Email provider
   */
  async sendEmail() {
    throw new Error(
      "Email provider is not configured yet."
    );
  },

  /**
   * Future:
   *
   * SMS provider
   */
  async sendSMS() {
    throw new Error(
      "SMS provider is not configured yet."
    );
  },
};

module.exports = notificationService;