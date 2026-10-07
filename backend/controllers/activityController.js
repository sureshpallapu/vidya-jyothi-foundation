const db = require("../config/db");
const fs = require("fs");

/*
|--------------------------------------------------------------------------
| CONSTANTS
|--------------------------------------------------------------------------
*/

const ACTIVITY_TYPES = [
  "EVENT",
  "PROGRAM",
  "CAMP",
  "DRIVE",
  "WORKSHOP",
  "MEETING",
  "AWARENESS",
  "DISTRIBUTION",
  "VOLUNTEER_ACTIVITY",
  "FUNDRAISING",
  "OTHER",
];

const ACTIVITY_STATUSES = [
  "DRAFT",
  "SCHEDULED",
  "REGISTRATION_OPEN",
  "REGISTRATION_CLOSED",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
  "POSTPONED",
  "ARCHIVED",
];

const VISIBILITY_OPTIONS = [
  "PUBLIC",
  "PRIVATE",
  "VOLUNTEERS_ONLY",
  "TRUSTEES_ONLY",
  "ADMIN_ONLY",
];

const PRIORITY_OPTIONS = [
  "LOW",
  "NORMAL",
  "HIGH",
  "URGENT",
];

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function toBoolean(value) {

  if (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true" ||
    value === "TRUE" ||
    value === "yes" ||
    value === "YES"
  ) {
    return 1;
  }

  return 0;
}

function nullable(value) {

  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  ) {
    return null;
  }

  return value;
}

function createSlug(value = "") {

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getUserId(req) {

  return (
    req?.user?.id ||
    req?.admin?.id ||
    null
  );
}

function isValidDate(value) {

  if (!value) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);

  return !Number.isNaN(date.getTime());
}

function toPositiveInteger(value) {

  const number = Number(value);

  if (
    !Number.isInteger(number) ||
    number < 1
  ) {
    return null;
  }

  return number;
}

/*
|--------------------------------------------------------------------------
| ACTIVITY CODE
|--------------------------------------------------------------------------
*/

async function generateActivityCode() {

  const year =
    new Date().getFullYear();

  const prefix =
    `VJF-ACT-${year}-`;

  const [rows] =
    await db.execute(
      `
        SELECT activity_code
        FROM activities
        WHERE activity_code LIKE ?
        ORDER BY id DESC
        LIMIT 1
      `,
      [`${prefix}%`]
    );

  let nextNumber = 1;

  if (
    rows.length &&
    rows[0].activity_code
  ) {

    const match =
      String(rows[0].activity_code)
        .match(/(\d+)$/);

    if (match) {

      nextNumber =
        Number.parseInt(
          match[1],
          10
        ) + 1;
    }
  }

  return (
    prefix +
    String(nextNumber).padStart(6, "0")
  );
}

/*
|--------------------------------------------------------------------------
| UNIQUE SLUG
|--------------------------------------------------------------------------
*/

async function generateUniqueSlug(
  title,
  excludeId = null
) {

  let baseSlug =
    createSlug(title);

  if (!baseSlug) {
    baseSlug =
      `activity-${Date.now()}`;
  }

  let slug = baseSlug;

  let counter = 1;

  while (true) {

    let sql = `
      SELECT id
      FROM activities
      WHERE slug = ?
    `;

    const params = [slug];

    if (excludeId !== null) {

      sql += `
        AND id != ?
      `;

      params.push(excludeId);
    }

    sql += `
      LIMIT 1
    `;

    const [rows] =
      await db.execute(
        sql,
        params
      );

    if (!rows.length) {
      return slug;
    }

    counter++;

    slug =
      `${baseSlug}-${counter}`;
  }
}

/*
|--------------------------------------------------------------------------
| SERVER ERROR
|--------------------------------------------------------------------------
*/

function serverError(
  res,
  message,
  error
) {

  console.error(
    "================================================"
  );

  console.error(message);

  console.error(error);

  console.error(
    "================================================"
  );

  return res.status(500).json({

    success: false,

    message,

    /*
     * Always expose the DB error during development.
     * This makes future debugging much easier.
     */

    error:
      process.env.NODE_ENV !== "production"
        ? error.message
        : undefined,
  });
}

/*
|--------------------------------------------------------------------------
| CREATE ACTIVITY
|--------------------------------------------------------------------------
*/

async function createActivity(
  req,
  res
) {

  try {

    const body =
      req.body || {};

    /*
    |--------------------------------------------------------------------------
    | BASIC
    |--------------------------------------------------------------------------
    */

    const title =
      String(body.title || "").trim();

    const activity_type =
      body.activity_type || "EVENT";

    const category =
      nullable(body.category);

    const description =
      nullable(body.description);

    const short_description =
      nullable(body.short_description);

    const objective =
      nullable(body.objective);

    /*
    |--------------------------------------------------------------------------
    | DATE / TIME
    |--------------------------------------------------------------------------
    */

    const start_date =
      body.start_date;

    const start_time =
      nullable(body.start_time);

    const end_date =
      nullable(body.end_date);

    const end_time =
      nullable(body.end_time);

    const is_all_day =
      toBoolean(body.is_all_day);

    const timezone =
      body.timezone ||
      "Asia/Kolkata";

    /*
    |--------------------------------------------------------------------------
    | LOCATION
    |--------------------------------------------------------------------------
    */

    const venue_name =
      nullable(body.venue_name);

    const address_line1 =
      nullable(body.address_line1);

    const address_line2 =
      nullable(body.address_line2);

    const city =
      nullable(body.city);

    const district =
      nullable(body.district);

    const state =
      nullable(body.state);

    const pincode =
      nullable(body.pincode);

    const latitude =
      nullable(body.latitude);

    const longitude =
      nullable(body.longitude);

    /*
    |--------------------------------------------------------------------------
    | ONLINE
    |--------------------------------------------------------------------------
    */

    const online_event =
      toBoolean(body.online_event);

    const meeting_url =
      nullable(body.meeting_url);

    /*
    |--------------------------------------------------------------------------
    | CAPACITY
    |--------------------------------------------------------------------------
    */

    let max_participants = null;

    if (
      body.max_participants !==
        undefined &&
      body.max_participants !==
        null &&
      body.max_participants !== ""
    ) {

      max_participants =
        toPositiveInteger(
          body.max_participants
        );

      if (
        max_participants === null
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Maximum participants must be a positive whole number.",
        });
      }
    }

    /*
    |--------------------------------------------------------------------------
    | REGISTRATION
    |--------------------------------------------------------------------------
    */

    const registration_required =
      toBoolean(
        body.registration_required
      );

    let registration_start =
      nullable(
        body.registration_start
      );

    let registration_end =
      nullable(
        body.registration_end
      );

    /*
     * Registration dates are meaningless
     * when registration is disabled.
     */

    if (
      registration_required === 0
    ) {

      registration_start =
        null;

      registration_end =
        null;
    }

    /*
    |--------------------------------------------------------------------------
    | PUBLISHING
    |--------------------------------------------------------------------------
    */

    const visibility =
      body.visibility || "PUBLIC";

    const status =
      body.status || "DRAFT";

    const priority =
      body.priority || "NORMAL";

    const featured =
      toBoolean(body.featured);

    /*
    |--------------------------------------------------------------------------
    | IMPORTANT
    |--------------------------------------------------------------------------
    |
    | NEVER publish automatically.
    |
    */

    const public_display = 0;

    /*
    |--------------------------------------------------------------------------
    | COVER IMAGE
    |--------------------------------------------------------------------------
    */

    let cover_image = null;

    /*
     * Preferred method:
     *
     * multipart/form-data
     * cover_image
     */

    if (req.file) {

      cover_image =
        `/uploads/activities/${req.file.filename}`;
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    if (!title) {

      return res.status(400).json({

        success: false,

        message:
          "Activity title is required.",
      });
    }

    if (!start_date) {

      return res.status(400).json({

        success: false,

        message:
          "Activity start date is required.",
      });
    }

    if (!isValidDate(start_date)) {

      return res.status(400).json({

        success: false,

        message:
          "Activity start date is invalid.",
      });
    }

    if (
      end_date &&
      !isValidDate(end_date)
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Activity end date is invalid.",
      });
    }

    if (
      end_date &&
      new Date(`${end_date}T00:00:00`) <
        new Date(`${start_date}T00:00:00`)
    ) {

      return res.status(400).json({

        success: false,

        message:
          "End date cannot be earlier than start date.",
      });
    }

    if (
      !ACTIVITY_TYPES.includes(
        activity_type
      )
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid activity type.",
      });
    }

    if (
      !ACTIVITY_STATUSES.includes(
        status
      )
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid activity status.",
      });
    }

    if (
      !VISIBILITY_OPTIONS.includes(
        visibility
      )
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid activity visibility.",
      });
    }

    if (
      !PRIORITY_OPTIONS.includes(
        priority
      )
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid activity priority.",
      });
    }

    if (
      online_event === 1 &&
      !meeting_url
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Meeting URL is required for an online activity.",
      });
    }

    if (
      registration_required === 1 &&
      registration_start &&
      registration_end &&
      new Date(registration_start) >
        new Date(registration_end)
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Registration start cannot be later than registration end.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | IDENTIFIERS
    |--------------------------------------------------------------------------
    */

    const activity_code =
      await generateActivityCode();

    const slug =
      await generateUniqueSlug(
        title
      );

    /*
    |--------------------------------------------------------------------------
    | USER
    |--------------------------------------------------------------------------
    */

    const userId =
      getUserId(req);

    /*
    |--------------------------------------------------------------------------
    | INSERT
    |--------------------------------------------------------------------------
    |
    | Keep this explicit.
    | It is much easier to debug than dynamic SQL.
    |
    */

    const sql = `
      INSERT INTO activities (

        activity_code,
        title,
        slug,

        activity_type,
        category,
        description,
        short_description,
        objective,

        start_date,
        start_time,
        end_date,
        end_time,
        is_all_day,
        timezone,

        venue_name,
        address_line1,
        address_line2,
        city,
        district,
        state,
        pincode,

        latitude,
        longitude,

        online_event,
        meeting_url,

        max_participants,

        registration_required,
        registration_start,
        registration_end,

        visibility,
        status,
        priority,

        featured,
        public_display,

        cover_image,

        created_by,
        updated_by

      )

      VALUES (

        ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?,
        ?, ?,
        ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?,
        ?, ?,
        ?, ?,
        ?, ?

      )
    `;

    const values = [

      activity_code,
      title,
      slug,

      activity_type,
      category,
      description,
      short_description,
      objective,

      start_date,
      start_time,
      end_date,
      end_time,
      is_all_day,
      timezone,

      venue_name,
      address_line1,
      address_line2,
      city,
      district,
      state,
      pincode,

      latitude,
      longitude,

      online_event,
      meeting_url,

      max_participants,

      registration_required,
      registration_start,
      registration_end,

      visibility,
      status,
      priority,

      featured,

      /*
       * ALWAYS HIDDEN
       */

      public_display,

      cover_image,

      userId,
      userId,
    ];

    /*
    |--------------------------------------------------------------------------
    | SAFETY
    |--------------------------------------------------------------------------
    */

    const placeholderCount =
      (
        sql.match(/\?/g) || []
      ).length;

    if (
      placeholderCount !==
      values.length
    ) {

      console.error(
        "ACTIVITY INSERT MISMATCH",
        {
          placeholderCount,
          valuesLength:
            values.length,
        }
      );

      return res.status(500).json({

        success: false,

        message:
          "Activity insert configuration mismatch.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | DATABASE
    |--------------------------------------------------------------------------
    */

    const [result] =
      await db.execute(
        sql,
        values
      );

    /*
    |--------------------------------------------------------------------------
    | FETCH CREATED
    |--------------------------------------------------------------------------
    */

    const [rows] =
      await db.execute(
        `
          SELECT *
          FROM activities
          WHERE id = ?
          LIMIT 1
        `,
        [result.insertId]
      );

    const activity =
      rows[0] || null;

    /*
    |--------------------------------------------------------------------------
    | RESPONSE
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({

      success: true,

      message:
        "Activity created successfully.",

      data: activity,

    });

  } catch (error) {

    /*
    |--------------------------------------------------------------------------
    | REMOVE ORPHAN IMAGE
    |--------------------------------------------------------------------------
    */

    if (
      req.file &&
      req.file.path
    ) {

      try {

        if (
          fs.existsSync(
            req.file.path
          )
        ) {

          fs.unlinkSync(
            req.file.path
          );
        }

      } catch (cleanupError) {

        console.error(
          "IMAGE CLEANUP ERROR:",
          cleanupError
        );
      }
    }

    return serverError(
      res,
      "Unable to create activity.",
      error
    );
  }
}

/*
|--------------------------------------------------------------------------
| GET ACTIVITIES
|--------------------------------------------------------------------------
*/

async function getActivities(
  req,
  res
) {

  try {

    const {
      search = "",
      status,
      activity_type,
      category,
      visibility,
      featured,
      from_date,
      to_date,
    } = req.query;

    const page =
      Math.max(
        Number.parseInt(
          req.query.page,
          10
        ) || 1,
        1
      );

    const limit =
      Math.min(
        Math.max(
          Number.parseInt(
            req.query.limit,
            10
          ) || 20,
          1
        ),
        100
      );

    const offset =
      (page - 1) * limit;

    const conditions = [];

    const params = [];

    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    if (
      search &&
      String(search).trim()
    ) {

      const value =
        `%${String(search).trim()}%`;

      conditions.push(`
        (
          a.activity_code LIKE ?
          OR a.title LIKE ?
          OR a.category LIKE ?
          OR a.description LIKE ?
          OR a.city LIKE ?
          OR a.district LIKE ?
        )
      `);

      params.push(
        value,
        value,
        value,
        value,
        value,
        value
      );
    }

    /*
    |--------------------------------------------------------------------------
    | FILTERS
    |--------------------------------------------------------------------------
    */

    if (status) {

      conditions.push(
        "a.status = ?"
      );

      params.push(status);
    }

    if (activity_type) {

      conditions.push(
        "a.activity_type = ?"
      );

      params.push(
        activity_type
      );
    }

    if (category) {

      conditions.push(
        "a.category = ?"
      );

      params.push(category);
    }

    if (visibility) {

      conditions.push(
        "a.visibility = ?"
      );

      params.push(visibility);
    }

    if (
      featured !== undefined
    ) {

      conditions.push(
        "a.featured = ?"
      );

      params.push(
        toBoolean(featured)
      );
    }

    if (from_date) {

      conditions.push(
        "a.start_date >= ?"
      );

      params.push(from_date);
    }

    if (to_date) {

      conditions.push(
        "a.start_date <= ?"
      );

      params.push(to_date);
    }

    const whereSQL =
      conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    /*
    |--------------------------------------------------------------------------
    | COUNT
    |--------------------------------------------------------------------------
    */

    const [countRows] =
      await db.execute(
        `
          SELECT COUNT(*) AS total
          FROM activities a
          ${whereSQL}
        `,
        params
      );

    const total =
      Number(
        countRows[0]?.total || 0
      );

    const totalPages =
      total
        ? Math.ceil(total / limit)
        : 0;

    /*
    |--------------------------------------------------------------------------
    | DATA
    |--------------------------------------------------------------------------
    */

    const [activities] =
      await db.execute(
        `
          SELECT a.*
          FROM activities a

          ${whereSQL}

          ORDER BY

            CASE

              WHEN a.status = 'ONGOING'
                THEN 1

              WHEN a.status = 'REGISTRATION_OPEN'
                THEN 2

              WHEN a.status = 'SCHEDULED'
                THEN 3

              WHEN a.status = 'DRAFT'
                THEN 4

              WHEN a.status = 'POSTPONED'
                THEN 5

              WHEN a.status = 'COMPLETED'
                THEN 6

              WHEN a.status = 'CANCELLED'
                THEN 7

              ELSE 8

            END,

            a.start_date ASC,
            a.start_time ASC,
            a.id DESC

          LIMIT ${limit}
          OFFSET ${offset}
        `,
        params
      );

    return res.status(200).json({

      success: true,

      data: activities,

      pagination: {

        page,

        limit,

        total,

        totalPages,

        hasNextPage:
          page < totalPages,

        hasPreviousPage:
          page > 1,
      },
    });

  } catch (error) {

    return serverError(
      res,
      "Unable to fetch activities.",
      error
    );
  }
}

/*
|--------------------------------------------------------------------------
| GET SINGLE ACTIVITY
|--------------------------------------------------------------------------
*/

async function getActivity(
  req,
  res
) {

  try {

    const {
      activityId,
    } = req.params;

    const [rows] =
      await db.execute(
        `
          SELECT *
          FROM activities

          WHERE
            id = ?
            OR activity_code = ?
            OR slug = ?

          LIMIT 1
        `,
        [
          activityId,
          activityId,
          activityId,
        ]
      );

    if (!rows.length) {

      return res.status(404).json({

        success: false,

        message:
          "Activity not found.",
      });
    }

    return res.status(200).json({

      success: true,

      data: rows[0],

    });

  } catch (error) {

    return serverError(
      res,
      "Unable to fetch activity.",
      error
    );
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE ACTIVITY
|--------------------------------------------------------------------------
*/

async function updateActivity(
  req,
  res
) {

  try {

    const {
      activityId,
    } = req.params;

    /*
    |--------------------------------------------------------------------------
    | FIND USING ID OR ACTIVITY CODE
    |--------------------------------------------------------------------------
    */

    const [rows] =
      await db.execute(
        `
          SELECT *
          FROM activities

          WHERE
            id = ?
            OR activity_code = ?

          LIMIT 1
        `,
        [
          activityId,
          activityId,
        ]
      );

    if (!rows.length) {

      return res.status(404).json({

        success: false,

        message:
          "Activity not found.",
      });
    }

    const existing =
      rows[0];

    const actualId =
      existing.id;

    const body =
      req.body || {};

    /*
    |--------------------------------------------------------------------------
    | FIELDS
    |--------------------------------------------------------------------------
    */

    const fields = [
      "title",
      "activity_type",
      "category",
      "description",
      "short_description",
      "objective",

      "start_date",
      "start_time",
      "end_date",
      "end_time",
      "is_all_day",
      "timezone",

      "venue_name",
      "address_line1",
      "address_line2",
      "city",
      "district",
      "state",
      "pincode",

      "latitude",
      "longitude",

      "online_event",
      "meeting_url",

      "max_participants",

      "registration_required",
      "registration_start",
      "registration_end",

      "visibility",
      "status",
      "priority",

      "featured",
      "public_display",
    ];

    const booleanFields = [
      "is_all_day",
      "online_event",
      "registration_required",
      "featured",
      "public_display",
    ];

    const nullableFields = [
      "category",
      "description",
      "short_description",
      "objective",

      "start_time",
      "end_date",
      "end_time",

      "venue_name",
      "address_line1",
      "address_line2",
      "city",
      "district",
      "state",
      "pincode",

      "latitude",
      "longitude",

      "meeting_url",

      "registration_start",
      "registration_end",
    ];

    const updates = [];

    const values = [];

    /*
    |--------------------------------------------------------------------------
    | NORMAL FIELDS
    |--------------------------------------------------------------------------
    */

    for (
      const field of fields
    ) {

      if (
        !Object.prototype.hasOwnProperty.call(
          body,
          field
        )
      ) {
        continue;
      }

      let value =
        body[field];

      if (
        booleanFields.includes(field)
      ) {

        value =
          toBoolean(value);
      }

      if (
        nullableFields.includes(field)
      ) {

        value =
          nullable(value);
      }

      updates.push(
        `\`${field}\` = ?`
      );

      values.push(value);
    }

    /*
    |--------------------------------------------------------------------------
    | NEW COVER IMAGE
    |--------------------------------------------------------------------------
    */

    if (req.file) {

      const newCoverImage =
        `/uploads/activities/${req.file.filename}`;

      updates.push(
        "`cover_image` = ?"
      );

      values.push(
        newCoverImage
      );
    }

    /*
    |--------------------------------------------------------------------------
    | TITLE -> SLUG
    |--------------------------------------------------------------------------
    */

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "title"
      ) &&
      String(body.title).trim() &&
      String(body.title).trim() !==
        String(existing.title || "").trim()
    ) {

      const slug =
        await generateUniqueSlug(
          body.title,
          actualId
        );

      updates.push(
        "`slug` = ?"
      );

      values.push(slug);
    }

    /*
    |--------------------------------------------------------------------------
    | REGISTRATION OFF
    |--------------------------------------------------------------------------
    */

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "registration_required"
      ) &&
      toBoolean(
        body.registration_required
      ) === 0
    ) {

      updates.push(
        "`registration_start` = NULL"
      );

      updates.push(
        "`registration_end` = NULL"
      );
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATED BY
    |--------------------------------------------------------------------------
    */

    updates.push(
      "`updated_by` = ?"
    );

    values.push(
      getUserId(req)
    );

    /*
    |--------------------------------------------------------------------------
    | NOTHING
    |--------------------------------------------------------------------------
    */

    if (!updates.length) {

      return res.status(400).json({

        success: false,

        message:
          "No fields were provided for update.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | ID
    |--------------------------------------------------------------------------
    */

    values.push(
      actualId
    );

    /*
    |--------------------------------------------------------------------------
    | UPDATE
    |--------------------------------------------------------------------------
    */

    await db.execute(
      `
        UPDATE activities

        SET
          ${updates.join(", ")}

        WHERE id = ?
      `,
      values
    );

    /*
    |--------------------------------------------------------------------------
    | FETCH
    |--------------------------------------------------------------------------
    */

    const [updatedRows] =
      await db.execute(
        `
          SELECT *
          FROM activities
          WHERE id = ?
          LIMIT 1
        `,
        [actualId]
      );

    return res.status(200).json({

      success: true,

      message:
        "Activity updated successfully.",

      data:
        updatedRows[0] || null,
    });

  } catch (error) {

    /*
    |--------------------------------------------------------------------------
    | REMOVE NEW IMAGE IF UPDATE FAILED
    |--------------------------------------------------------------------------
    */

    if (
      req.file &&
      req.file.path
    ) {

      try {

        if (
          fs.existsSync(
            req.file.path
          )
        ) {

          fs.unlinkSync(
            req.file.path
          );
        }

      } catch (cleanupError) {

        console.error(
          "UPDATE IMAGE CLEANUP ERROR:",
          cleanupError
        );
      }
    }

    return serverError(
      res,
      "Unable to update activity.",
      error
    );
  }
}

/*
|--------------------------------------------------------------------------
| ARCHIVE
|--------------------------------------------------------------------------
*/

async function deleteActivity(
  req,
  res
) {

  try {

    const {
      activityId,
    } = req.params;

    const [rows] =
      await db.execute(
        `
          SELECT id
          FROM activities

          WHERE
            id = ?
            OR activity_code = ?

          LIMIT 1
        `,
        [
          activityId,
          activityId,
        ]
      );

    if (!rows.length) {

      return res.status(404).json({

        success: false,

        message:
          "Activity not found.",
      });
    }

    await db.execute(
      `
        UPDATE activities

        SET
          status = 'ARCHIVED',
          public_display = 0,
          updated_by = ?

        WHERE id = ?
      `,
      [
        getUserId(req),
        rows[0].id,
      ]
    );

    return res.status(200).json({

      success: true,

      message:
        "Activity archived successfully.",
    });

  } catch (error) {

    return serverError(
      res,
      "Unable to archive activity.",
      error
    );
  }
}

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

module.exports = {

  createActivity,

  getActivities,

  getActivity,

  updateActivity,

  deleteActivity,

};