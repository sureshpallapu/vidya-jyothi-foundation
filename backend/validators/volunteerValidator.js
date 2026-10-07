const Joi = require("joi");


/*
|--------------------------------------------------------------------------
| Common Patterns
|--------------------------------------------------------------------------
*/

const mobilePattern =
    /^[6-9]\d{9}$/;


const pincodePattern =
    /^\d{6}$/;


const aadhaarPattern =
    /^\d{12}$/;


/*
|--------------------------------------------------------------------------
| Common Fields
|--------------------------------------------------------------------------
*/

const commonFields = {

    full_name: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required()
        .messages({

            "string.empty":
                "Full name is required.",

            "string.min":
                "Full name must contain at least 2 characters.",

            "string.max":
                "Full name cannot exceed 150 characters.",

            "any.required":
                "Full name is required."

        }),


    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .max(150)
        .required()
        .messages({

            "string.empty":
                "Email address is required.",

            "string.email":
                "Please enter a valid email address.",

            "string.max":
                "Email address cannot exceed 150 characters.",

            "any.required":
                "Email address is required."

        }),


    mobile: Joi.string()
        .trim()
        .pattern(mobilePattern)
        .required()
        .messages({

            "string.empty":
                "Mobile number is required.",

            "string.pattern.base":
                "Please enter a valid 10-digit Indian mobile number.",

            "any.required":
                "Mobile number is required."

        }),


    alternate_mobile: Joi.string()
        .trim()
        .pattern(mobilePattern)
        .allow("", null)
        .messages({

            "string.pattern.base":
                "Please enter a valid alternate mobile number."

        }),


    city: Joi.string()
        .trim()
        .max(100)
        .allow("", null),


    district: Joi.string()
        .trim()
        .max(100)
        .allow("", null),


    state: Joi.string()
        .trim()
        .max(100)
        .default("Andhra Pradesh")
        .allow("", null),


    pincode: Joi.string()
        .trim()
        .pattern(pincodePattern)
        .allow("", null)
        .messages({

            "string.pattern.base":
                "Pincode must contain exactly 6 digits."

        }),


    area_of_interest: Joi.string()
        .trim()
        .max(150)
        .allow("", null),


    message: Joi.string()
        .trim()
        .max(2000)
        .allow("", null),


    date_of_birth: Joi.date()
        .iso()
        .max("now")
        .allow(null, "")
        .messages({

            "date.format":
                "Please enter a valid date of birth.",

            "date.max":
                "Date of birth cannot be in the future."

        }),


    gender: Joi.string()
        .valid(
            "MALE",
            "FEMALE",
            "OTHER",
            "PREFER_NOT_TO_SAY"
        )
        .allow(null, ""),


    aadhaar: Joi.string()
        .trim()
        .pattern(aadhaarPattern)
        .allow("", null)
        .messages({

            "string.pattern.base":
                "Aadhaar number must contain exactly 12 digits."

        }),


    address_line1: Joi.string()
        .trim()
        .max(255)
        .allow("", null),


    address_line2: Joi.string()
        .trim()
        .max(255)
        .allow("", null),


    highest_qualification: Joi.string()
        .trim()
        .max(150)
        .allow("", null),


    course: Joi.string()
        .trim()
        .max(150)
        .allow("", null),


    profession: Joi.string()
        .trim()
        .max(150)
        .allow("", null),


    organization: Joi.string()
        .trim()
        .max(200)
        .allow("", null),


    years_of_experience: Joi.number()
        .min(0)
        .max(99.99)
        .precision(2)
        .allow(null, ""),


    primary_interest: Joi.string()
        .trim()
        .max(150)
        .allow("", null),


    secondary_interest: Joi.string()
        .trim()
        .max(150)
        .allow("", null),


    skills: Joi.string()
        .trim()
        .max(5000)
        .allow("", null),


    languages_known: Joi.string()
        .trim()
        .max(500)
        .allow("", null),


    previous_volunteer_experience: Joi.string()
        .trim()
        .max(5000)
        .allow("", null),


    availability_weekdays: Joi.boolean()
        .default(false),


    availability_weekends: Joi.boolean()
        .default(false),


    availability_evenings: Joi.boolean()
        .default(false),


    preferred_mode: Joi.string()
        .valid(
            "ONLINE",
            "OFFLINE",
            "BOTH"
        )
        .allow(null, ""),


    emergency_contact_name: Joi.string()
        .trim()
        .max(150)
        .allow("", null),


    emergency_contact_relationship: Joi.string()
        .trim()
        .max(100)
        .allow("", null),


    emergency_contact_mobile: Joi.string()
        .trim()
        .pattern(mobilePattern)
        .allow("", null)
        .messages({

            "string.pattern.base":
                "Please enter a valid emergency contact mobile number."

        }),


    profile_image: Joi.string()
        .max(500)
        .allow("", null),


    short_bio: Joi.string()
        .trim()
        .max(3000)
        .allow("", null),


    volunteer_type: Joi.string()
        .valid(
            "REGULAR",
            "OCCASIONAL",
            "STUDENT",
            "PROFESSIONAL",
            "CORPORATE",
            "OTHER"
        )
        .default("REGULAR"),


    coordinator_id: Joi.number()
        .integer()
        .positive()
        .allow(null),


    internal_remarks: Joi.string()
        .trim()
        .max(5000)
        .allow("", null),


    application_source: Joi.string()
        .valid(
            "PUBLIC",
            "ADMIN_OFFLINE"
        )
        .default("PUBLIC"),


    created_by: Joi.number()
        .integer()
        .positive()
        .allow(null),


    updated_by: Joi.number()
        .integer()
        .positive()
        .allow(null)

};


/*
|--------------------------------------------------------------------------
| PUBLIC VOLUNTEER REGISTRATION
|--------------------------------------------------------------------------
|
| Public users should provide only initial information.
|
| We intentionally do NOT require Aadhaar here.
|
|--------------------------------------------------------------------------
*/

const publicVolunteerSchema =
    Joi.object({

        full_name:
            commonFields.full_name,

        email:
            commonFields.email,

        mobile:
            commonFields.mobile,

        city:
            commonFields.city,

        district:
            commonFields.district,

        state:
            commonFields.state,

        pincode:
            commonFields.pincode,

        area_of_interest:
            commonFields.area_of_interest,

        message:
            commonFields.message,

        application_source:
            Joi.any()
                .default("PUBLIC")
                .custom(() => "PUBLIC")

    });


/*
|--------------------------------------------------------------------------
| ADMIN OFFLINE VOLUNTEER CREATION
|--------------------------------------------------------------------------
|
| Admin can enter a more complete profile.
|
|--------------------------------------------------------------------------
*/

const adminVolunteerSchema =
    Joi.object({

        ...commonFields,

        application_source:
            Joi.any()
                .default("ADMIN_OFFLINE")
                .custom(() => "ADMIN_OFFLINE")

    });


/*
|--------------------------------------------------------------------------
| ADMIN COMPLETE PROFILE
|--------------------------------------------------------------------------
|
| Used after public volunteer is approved/reviewed.
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| ADMIN COMPLETE PROFILE
|--------------------------------------------------------------------------
|
| Used when admin reviews an existing volunteer and
| adds or updates the remaining profile information.
|
| IMPORTANT:
| All fields are optional because this is an UPDATE operation.
| Admin can save the profile in multiple stages.
|
|--------------------------------------------------------------------------
*/

const completeVolunteerProfileSchema =
    Joi.object({

        full_name:
            commonFields.full_name.optional(),

        alternate_mobile:
            commonFields.alternate_mobile.optional(),

        city:
            commonFields.city.optional(),

        district:
            commonFields.district.optional(),

        state:
            commonFields.state.optional(),

        pincode:
            commonFields.pincode.optional(),

        date_of_birth:
            commonFields.date_of_birth.optional(),

        gender:
            commonFields.gender.optional(),

        aadhaar:
            commonFields.aadhaar.optional(),

        address_line1:
            commonFields.address_line1.optional(),

        address_line2:
            commonFields.address_line2.optional(),

        highest_qualification:
            commonFields.highest_qualification.optional(),

        course:
            commonFields.course.optional(),

        profession:
            commonFields.profession.optional(),

        organization:
            commonFields.organization.optional(),

        years_of_experience:
            commonFields.years_of_experience.optional(),

        primary_interest:
            commonFields.primary_interest.optional(),

        secondary_interest:
            commonFields.secondary_interest.optional(),

        skills:
            commonFields.skills.optional(),

        languages_known:
            commonFields.languages_known.optional(),

        previous_volunteer_experience:
            commonFields.previous_volunteer_experience.optional(),

        availability_weekdays:
            commonFields.availability_weekdays.optional(),

        availability_weekends:
            commonFields.availability_weekends.optional(),

        availability_evenings:
            commonFields.availability_evenings.optional(),

        preferred_mode:
            commonFields.preferred_mode.optional(),

        emergency_contact_name:
            commonFields.emergency_contact_name.optional(),

        emergency_contact_relationship:
            commonFields.emergency_contact_relationship.optional(),

        emergency_contact_mobile:
            commonFields.emergency_contact_mobile.optional(),

        profile_image:
            commonFields.profile_image.optional(),

        short_bio:
            commonFields.short_bio.optional(),

        volunteer_type:
            commonFields.volunteer_type.optional(),

        coordinator_id:
            commonFields.coordinator_id.optional(),

        internal_remarks:
            commonFields.internal_remarks.optional(),

        updated_by:
            commonFields.updated_by.optional()

    })
    .unknown(false);


/*
|--------------------------------------------------------------------------
| Approve Volunteer
|--------------------------------------------------------------------------
*/

const approveVolunteerSchema =
    Joi.object({

        approved_by:
            Joi.number()
                .integer()
                .positive()
                .required(),

        internal_remarks:
            Joi.string()
                .trim()
                .max(5000)
                .allow("", null)

    });


/*
|--------------------------------------------------------------------------
| Reject Volunteer
|--------------------------------------------------------------------------
*/

const rejectVolunteerSchema =
    Joi.object({

        rejected_by:
            Joi.number()
                .integer()
                .positive()
                .required(),

        rejection_reason:
            Joi.string()
                .trim()
                .min(5)
                .max(2000)
                .required()
                .messages({

                    "string.empty":
                        "Rejection reason is required.",

                    "string.min":
                        "Rejection reason must contain at least 5 characters.",

                    "string.max":
                        "Rejection reason cannot exceed 2000 characters."

                })

    });


/*
|--------------------------------------------------------------------------
| Suspend Volunteer
|--------------------------------------------------------------------------
*/

const suspendVolunteerSchema =
    Joi.object({

        updated_by:
            Joi.number()
                .integer()
                .positive()
                .required(),

        reason:
            Joi.string()
                .trim()
                .min(5)
                .max(2000)
                .required()
                .messages({

                    "string.empty":
                        "Suspension reason is required.",

                    "string.min":
                        "Suspension reason must contain at least 5 characters."

                })

    });


/*
|--------------------------------------------------------------------------
| Status Update
|--------------------------------------------------------------------------
*/

const statusUpdateSchema =
    Joi.object({

        status:
            Joi.string()
                .valid(
                    "APPROVED",
                    "ACTIVE",
                    "INACTIVE",
                    "SUSPENDED",
                    "REJECTED",
                    "ARCHIVED"
                )
                .required(),

        updated_by:
            Joi.number()
                .integer()
                .positive()
                .required()

    });


/*
|--------------------------------------------------------------------------
| List Volunteers
|--------------------------------------------------------------------------
*/

const listVolunteerSchema =
    Joi.object({

        page:
            Joi.number()
                .integer()
                .min(1)
                .default(1),

        limit:
            Joi.number()
                .integer()
                .min(1)
                .max(100)
                .default(20),

        search:
            Joi.string()
                .trim()
                .max(100)
                .allow("", null),

        status:
            Joi.string()
                .valid(
                    "PENDING",
                    "APPROVED",
                    "ACTIVE",
                    "INACTIVE",
                    "SUSPENDED",
                    "REJECTED",
                    "ARCHIVED"
                )
                .allow("", null),

        application_source:
            Joi.string()
                .valid(
                    "PUBLIC",
                    "ADMIN_OFFLINE"
                )
                .allow("", null),

        city:
            Joi.string()
                .trim()
                .max(100)
                .allow("", null),

        district:
            Joi.string()
                .trim()
                .max(100)
                .allow("", null),

        volunteer_type:
            Joi.string()
                .valid(
                    "REGULAR",
                    "OCCASIONAL",
                    "STUDENT",
                    "PROFESSIONAL",
                    "CORPORATE",
                    "OTHER"
                )
                .allow("", null)

    });


/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {

    publicVolunteerSchema,

    adminVolunteerSchema,

    completeVolunteerProfileSchema,

    approveVolunteerSchema,

    rejectVolunteerSchema,

    suspendVolunteerSchema,

    statusUpdateSchema,

    listVolunteerSchema

};