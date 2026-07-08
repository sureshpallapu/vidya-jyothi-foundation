const db = require("../config/db");
const { APPLICATION_PREFIX } = require("../config/constants");

const generateApplicationId = () => {
  return new Promise((resolve, reject) => {

    // Get active scholarship cycle
    const cycleSql = `
      SELECT id, scholarship_year
      FROM scholarship_cycles
      WHERE is_active = TRUE
      LIMIT 1
    `;

    db.query(cycleSql, (err, cycleResult) => {

      if (err) return reject(err);

      if (cycleResult.length === 0) {
        return reject(new Error("No active scholarship cycle found."));
      }

      const cycle = cycleResult[0];

      // Find highest sequence number
      const sequenceSql = `
        SELECT MAX(application_sequence) AS lastSequence
        FROM scholarship_applications
        WHERE cycle_id = ?
      `;

      db.query(sequenceSql, [cycle.id], (err, sequenceResult) => {

        if (err) return reject(err);

        const lastSequence =
          sequenceResult[0].lastSequence || 0;

        const nextSequence = lastSequence + 1;

        const applicationId =
          APPLICATION_PREFIX +
          cycle.scholarship_year +
          String(nextSequence).padStart(5, "0");

        resolve({
          cycleId: cycle.id,
          applicationId,
          applicationSequence: nextSequence,
        });

      });

    });

  });
};

module.exports = generateApplicationId;