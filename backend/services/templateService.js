/**
 * ============================================================================
 * VIDYA JYOTHI FOUNDATION
 * Template Service
 * ============================================================================
 */

const templateService = {
  /**
   * Resolve variables inside a message.
   *
   * Example:
   *
   * "Hello {{volunteer_name}}"
   *
   * becomes:
   *
   * "Hello Suresh"
   */
  renderTemplate(template, variables = {}) {
    if (!template) {
      return "";
    }

    return template.replace(
      /{{\s*([^}]+)\s*}}/g,
      (match, key) => {
        const value = variables[key.trim()];

        return value !== undefined && value !== null
          ? String(value)
          : match;
      }
    );
  },

  /**
   * Future database-backed template lookup.
   */
  async getTemplate(templateCode, channel) {
    return {
      templateCode,
      channel,
      content: null,
    };
  },
};

module.exports = templateService;