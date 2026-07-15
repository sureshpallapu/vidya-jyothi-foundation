const db = require("../config/db");



const generateApplicationId = async () => {

  /*
  |--------------------------------------------------------------------------
  | Get Active Scholarship Cycle
  |--------------------------------------------------------------------------
  */

  const cycleSql = `
    SELECT
      id,
      scholarship_year
    FROM scholarship_cycles
    WHERE is_active = TRUE
    LIMIT 1
  `;

  const [cycleResult] =
    await db.query(cycleSql);

  if (cycleResult.length === 0) {

    throw new Error(
      "No active scholarship cycle found."
    );

  }

  const cycle = cycleResult[0];

  /*
|--------------------------------------------------------------------------
| Get Application Prefix
|--------------------------------------------------------------------------
*/

const [settingsResult] = await db.query(`
  SELECT application_prefix
  FROM settings
  WHERE id = 1
`);

const APPLICATION_PREFIX =
  settingsResult[0]?.application_prefix || "VJF";

  /*
  |--------------------------------------------------------------------------
  | Get Last Sequence
  |--------------------------------------------------------------------------
  */

  const sequenceSql = `
    SELECT
      MAX(application_sequence)
      AS lastSequence
    FROM scholarship_applications
    WHERE cycle_id = ?
  `;

  const [sequenceResult] =
    await db.query(
      sequenceSql,
      [cycle.id]
    );

  const lastSequence =
    sequenceResult[0].lastSequence || 0;

  const nextSequence =
    lastSequence + 1;

  /*
  |--------------------------------------------------------------------------
  | Generate Application ID
  |--------------------------------------------------------------------------
  */

  const applicationId =
    APPLICATION_PREFIX +
    cycle.scholarship_year +
    String(nextSequence).padStart(5, "0");

  return {

    cycleId: cycle.id,

    applicationId,

    applicationSequence:
      nextSequence,

  };

};

module.exports =
  generateApplicationId;