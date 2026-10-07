const VolunteerModel = require("../models/volunteerModel");
const ApiResponse = require("../utils/ApiResponse");

const {
    decryptSensitive,
    maskMobile,
    maskEmail,
    maskAadhaar,
    normalizeAadhaar,
    createAadhaarHash,
    encryptSensitive,
} = require("../utils/volunteerSecurity");

const {
    publicVolunteerSchema,
    adminVolunteerSchema,
    completeVolunteerProfileSchema,
    approveVolunteerSchema,
    rejectVolunteerSchema,
    suspendVolunteerSchema,
    statusUpdateSchema,
    listVolunteerSchema
} = require("../validators/volunteerValidator");

/*
|--------------------------------------------------------------------------
| CHECK AADHAAR DUPLICATE
|--------------------------------------------------------------------------
| POST /api/volunteers/admin/check-aadhaar
|
| - Normalize Aadhaar
| - Generate secure blind index/hash
| - Check whether another volunteer already owns it
| - Never expose another volunteer's Aadhaar
|--------------------------------------------------------------------------
*/
const checkAadhaarDuplicate = async (req, res) => {
    try {
        const { aadhaar, volunteer_code } = req.body;

        if (!aadhaar) {
            return res.status(400).json({
                success: false,
                code: "AADHAAR_REQUIRED",
                message: "Aadhaar number is required."
            });
        }

        const normalizedAadhaar = normalizeAadhaar(aadhaar);

        if (!normalizedAadhaar || normalizedAadhaar.length !== 12) {
            return res.status(400).json({
                success: false,
                code: "INVALID_AADHAAR",
                message: "Aadhaar number must contain exactly 12 digits."
            });
        }

        const aadhaarHash = createAadhaarHash(normalizedAadhaar);

        const duplicate = await VolunteerModel.checkAadhaarDuplicate(
            aadhaarHash,
            volunteer_code || null
        );

        if (duplicate) {
            return res.status(409).json({
                success: false,
                code: "VOLUNTEER_DUPLICATE",
                message: "This Aadhaar number is already registered with another volunteer.",
                duplicates: [
                    {
                        field: "aadhaar",
                        message: "A volunteer with this Aadhaar number already exists.",
                        volunteer_code: duplicate.volunteer_code,
                        status: duplicate.status
                    }
                ]
            });
        }

        return res.status(200).json({
            success: true,
            message: "Aadhaar number is available."
        });
    } catch (error) {
        console.error("CHECK AADHAAR ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to check Aadhaar number."
        });
    }
};

/*
|--------------------------------------------------------------------------
| PUBLIC — Create Volunteer
|--------------------------------------------------------------------------
*/
async function createPublicVolunteer(req, res) {
    try {
        const { error, value } = publicVolunteerSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            return ApiResponse.validationError(
                res,
                error.details.map((item) => item.message)
            );
        }

        /*
        |----------------------------------------------------------------
        | Force Public Source
        |----------------------------------------------------------------
        */
        value.application_source = "PUBLIC";

        /*
        |----------------------------------------------------------------
        | Force Pending Status
        |----------------------------------------------------------------
        |
        | Public users must NEVER be able to choose:
        |
        | ACTIVE
        | APPROVED
        | REJECTED
        | etc.
        |
        |----------------------------------------------------------------
        */
        value.status = "PENDING";

        const volunteer = await VolunteerModel.createVolunteer(value);

        return ApiResponse.created(
            res,
            "Volunteer application submitted successfully.",
            volunteer
        );
    } catch (error) {
        console.error("❌ Public volunteer creation error:", error);

        /*
        |----------------------------------------------------------------
        | Duplicate Volunteer
        |----------------------------------------------------------------
        */
        if (error.code === "VOLUNTEER_DUPLICATE") {
            return res.status(409).json({
                success: false,
                code: "VOLUNTEER_DUPLICATE",
                message: error.message,
                duplicates: error.duplicates || []
            });
        }

        return ApiResponse.error(
            res,
            error.message || "Unable to submit volunteer application."
        );
    }
}

/*
|--------------------------------------------------------------------------
| ADMIN — Create Offline Volunteer
|--------------------------------------------------------------------------
*/
async function createAdminVolunteer(req, res) {
    try {
        const { error, value } = adminVolunteerSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            return ApiResponse.validationError(
                res,
                error.details.map((item) => item.message)
            );
        }

        /*
        |----------------------------------------------------------------
        | Force Admin Source
        |----------------------------------------------------------------
        */
        value.application_source = "ADMIN_OFFLINE";

        /*
        |----------------------------------------------------------------
        | Offline Admin Creation Starts Pending
        |----------------------------------------------------------------
        */
        value.status = "PENDING";

        /*
        |----------------------------------------------------------------
        | Admin ID
        |----------------------------------------------------------------
        */
        value.created_by = req.user?.id || 1;
        value.updated_by = req.user?.id || 1;

        const volunteer = await VolunteerModel.createVolunteer(value);

        return ApiResponse.created(
            res,
            "Offline volunteer created successfully.",
            volunteer
        );
    } catch (error) {
        console.error("❌ Admin volunteer creation error:", error);

        if (error.code === "VOLUNTEER_DUPLICATE") {
            return res.status(409).json({
                success: false,
                code: "VOLUNTEER_DUPLICATE",
                message: error.message,
                duplicates: error.duplicates || []
            });
        }

        return ApiResponse.error(res, error.message || "Unable to create volunteer.");
    }
}

/*
|--------------------------------------------------------------------------
| GET — Volunteer By Code
|--------------------------------------------------------------------------
|
| Safe/masked information only.
|
|--------------------------------------------------------------------------
*/
async function getVolunteer(req, res) {
    try {
        const { volunteerCode } = req.params;

        const volunteer = await VolunteerModel.getSafeProfile(volunteerCode);

        if (!volunteer) {
            return ApiResponse.notFound(res, "Volunteer not found.");
        }

        return ApiResponse.success(res, "Volunteer fetched successfully.", volunteer);
    } catch (error) {
        console.error("❌ Get volunteer error:", error);

        return ApiResponse.error(res, error.message);
    }
}

/*
|--------------------------------------------------------------------------
| ADMIN — Get Sensitive Volunteer Profile
|--------------------------------------------------------------------------
|
| This endpoint will later be protected using:
|
| authenticateAdmin
| authorizeRoles(...)
|
|--------------------------------------------------------------------------
*/
async function getAdminVolunteer(req, res) {
    try {
        const { volunteerCode } = req.params;

        const volunteer = await VolunteerModel.findByCode(volunteerCode);

        if (!volunteer) {
            return ApiResponse.notFound(res, "Volunteer not found.");
        }

        /*
        |----------------------------------------------------------------
        | SECURITY
        |----------------------------------------------------------------
        | Never expose:
        |
        | email_encrypted
        | email_hash
        | mobile_encrypted
        | mobile_hash
        | aadhaar_encrypted
        | aadhaar_hash
        |
        |----------------------------------------------------------------
        */
        const safeVolunteer = {
            id: volunteer.id,
            volunteer_code: volunteer.volunteer_code,
            full_name: volunteer.full_name,

            /* Masked Contact Information */
            email: volunteer.email ? maskEmail(volunteer.email) : null,
            mobile: volunteer.mobile ? maskMobile(volunteer.mobile) : null,
            alternate_mobile: volunteer.alternate_mobile
                ? maskMobile(volunteer.alternate_mobile)
                : null,

            /* Location */
            city: volunteer.city,
            district: volunteer.district,
            state: volunteer.state,
            pincode: volunteer.pincode,

            /* Application */
            area_of_interest: volunteer.area_of_interest,
            message: volunteer.message,

            /* Personal */
            date_of_birth: volunteer.date_of_birth,
            gender: volunteer.gender,

            /* Identity Verification */
            aadhaar: volunteer.aadhaar ? maskAadhaar(volunteer.aadhaar) : null,
            aadhaar_verified: Boolean(volunteer.aadhaar_verified),
            email_verified: Boolean(volunteer.email_verified),
            mobile_verified: Boolean(volunteer.mobile_verified),

            /* Address */
            address_line1: volunteer.address_line1,
            address_line2: volunteer.address_line2,

            /* Education / Profession */
            highest_qualification: volunteer.highest_qualification,
            course: volunteer.course,
            profession: volunteer.profession,
            organization: volunteer.organization,
            years_of_experience: volunteer.years_of_experience,

            /* Interests / Skills */
            primary_interest: volunteer.primary_interest,
            secondary_interest: volunteer.secondary_interest,
            skills: volunteer.skills,
            languages_known: volunteer.languages_known,
            previous_volunteer_experience: volunteer.previous_volunteer_experience,

            /* Availability */
            availability_weekdays: Boolean(volunteer.availability_weekdays),
            availability_weekends: Boolean(volunteer.availability_weekends),
            availability_evenings: Boolean(volunteer.availability_evenings),
            preferred_mode: volunteer.preferred_mode,

            /* Emergency Contact */
            emergency_contact_name: volunteer.emergency_contact_name,
            emergency_contact_relationship: volunteer.emergency_contact_relationship,
            emergency_contact_mobile: volunteer.emergency_contact_mobile
                ? maskMobile(volunteer.emergency_contact_mobile)
                : null,

            /* Profile */
            profile_image: volunteer.profile_image,
            short_bio: volunteer.short_bio,
            profile_completion_percent: volunteer.profile_completion_percent,
            volunteer_type: volunteer.volunteer_type,

            /* Administration */
            coordinator_id: volunteer.coordinator_id,
            internal_remarks: volunteer.internal_remarks,
            status: volunteer.status,
            approved_by: volunteer.approved_by,
            approved_at: volunteer.approved_at,
            rejected_by: volunteer.rejected_by,
            rejected_at: volunteer.rejected_at,
            rejection_reason: volunteer.rejection_reason,
            activated_by: volunteer.activated_by,
            activated_at: volunteer.activated_at,
            application_source: volunteer.application_source,
            created_by: volunteer.created_by,
            updated_by: volunteer.updated_by,
            archived_by: volunteer.archived_by,
            archived_at: volunteer.archived_at,
            created_at: volunteer.created_at,
            updated_at: volunteer.updated_at
        };

        return ApiResponse.success(
            res,
            "Volunteer details fetched successfully.",
            safeVolunteer
        );
    } catch (error) {
        console.error("❌ Get admin volunteer error:", error);

        return ApiResponse.error(res, error.message || "Unable to fetch volunteer.");
    }
}

/*
|--------------------------------------------------------------------------
| ADMIN — Complete / Update Volunteer Profile
|--------------------------------------------------------------------------
*/
const completeVolunteerProfile = async (req, res) => {
    try {
        const { volunteerCode } = req.params;
        const incoming = req.body;

        if (!volunteerCode) {
            return res.status(400).json({
                success: false,
                message: "Volunteer code is required."
            });
        }

        /*
        |----------------------------------------------------------------
        | 1. Find existing volunteer
        |----------------------------------------------------------------
        */
        const existing = await VolunteerModel.findByCode(volunteerCode);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Volunteer not found."
            });
        }

        /*
        |----------------------------------------------------------------
        | 2. Merge existing + incoming data
        |----------------------------------------------------------------
        |
        | We intentionally do NOT require email/mobile from the admin
        | form because those are already securely stored from the
        | public application.
        |
        |----------------------------------------------------------------
        */
        const merged = { ...existing, ...incoming };

        /*
        |----------------------------------------------------------------
        | 3. Validate final profile
        |----------------------------------------------------------------
        */
        const errors = [];

        if (!merged.full_name || !String(merged.full_name).trim()) {
            errors.push("Full name is required.");
        }

        if (!merged.date_of_birth) {
            errors.push("Date of birth is required.");
        }

        if (!merged.gender) {
            errors.push("Gender is required.");
        }

        if (!merged.address_line1 || !String(merged.address_line1).trim()) {
            errors.push("Address is required.");
        }

        if (!merged.pincode || !String(merged.pincode).trim()) {
            errors.push("Pincode is required.");
        }

        if (!merged.highest_qualification || !String(merged.highest_qualification).trim()) {
            errors.push("Highest qualification is required.");
        }

        if (!merged.profession || !String(merged.profession).trim()) {
            errors.push("Profession is required.");
        }

        if (!merged.primary_interest || !String(merged.primary_interest).trim()) {
            errors.push("Primary interest is required.");
        }

        if (!merged.preferred_mode) {
            errors.push("Preferred mode is required.");
        }

        if (!merged.emergency_contact_name || !String(merged.emergency_contact_name).trim()) {
            errors.push("Emergency contact name is required.");
        }

        if (
            !merged.emergency_contact_relationship ||
            !String(merged.emergency_contact_relationship).trim()
        ) {
            errors.push("Emergency contact relationship is required.");
        }

        if (!merged.emergency_contact_mobile || !String(merged.emergency_contact_mobile).trim()) {
            errors.push("Emergency contact mobile is required.");
        }

        if (errors.length > 0) {
            return res.status(422).json({
                success: false,
                message: "Validation failed.",
                errors
            });
        }

        /*
        |----------------------------------------------------------------
        | 4. Aadhaar
        |----------------------------------------------------------------
        */
        let aadhaarHash = null;
        let aadhaarEncrypted = null;

        if (incoming.aadhaar) {
            const normalizedAadhaar = normalizeAadhaar(incoming.aadhaar);

            if (!normalizedAadhaar || normalizedAadhaar.length !== 12) {
                return res.status(422).json({
                    success: false,
                    message: "Validation failed.",
                    errors: ["Aadhaar number must contain exactly 12 digits."]
                });
            }

            aadhaarHash = createAadhaarHash(normalizedAadhaar);

            /* Duplicate check */
            const duplicate = await VolunteerModel.checkAadhaarDuplicate(
                aadhaarHash,
                volunteerCode
            );

            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    code: "VOLUNTEER_DUPLICATE",
                    message: "This Aadhaar number is already registered with another volunteer.",
                    duplicates: [
                        {
                            field: "aadhaar",
                            message: "A volunteer with this Aadhaar number already exists.",
                            volunteer_code: duplicate.volunteer_code,
                            status: duplicate.status
                        }
                    ]
                });
            }

            aadhaarEncrypted = encryptSensitive(normalizedAadhaar);
        }

        /*
        |----------------------------------------------------------------
        | 5. Prepare update
        |----------------------------------------------------------------
        */
        const updateData = {
            full_name: String(merged.full_name).trim(),
            date_of_birth: merged.date_of_birth,
            gender: merged.gender,
            address_line1: merged.address_line1,
            address_line2: merged.address_line2 || null,
            city: merged.city || null,
            district: merged.district || null,
            state: merged.state || null,
            pincode: merged.pincode,
            highest_qualification: merged.highest_qualification,
            course: merged.course || null,
            profession: merged.profession,
            organization: merged.organization || null,
            years_of_experience:
                merged.years_of_experience === "" || merged.years_of_experience == null
                    ? null
                    : Number(merged.years_of_experience),
            primary_interest: merged.primary_interest,
            secondary_interest: merged.secondary_interest || null,
            skills: merged.skills || null,
            languages_known: merged.languages_known || null,
            previous_volunteer_experience: merged.previous_volunteer_experience || null,
            availability_weekdays: Boolean(merged.availability_weekdays),
            availability_weekends: Boolean(merged.availability_weekends),
            availability_evenings: Boolean(merged.availability_evenings),
            preferred_mode: merged.preferred_mode,
            emergency_contact_name: merged.emergency_contact_name,
            emergency_contact_relationship: merged.emergency_contact_relationship,
            emergency_contact_mobile: merged.emergency_contact_mobile,
            volunteer_type: merged.volunteer_type || "REGULAR",
            short_bio: merged.short_bio || null,
            updated_by: req.admin?.id || 1
        };

        /*
        |----------------------------------------------------------------
        | Aadhaar only changes when supplied
        |----------------------------------------------------------------
        */
        if (aadhaarHash && aadhaarEncrypted) {
            updateData.aadhaar_hash = aadhaarHash;
            updateData.aadhaar_encrypted = aadhaarEncrypted;
            updateData.aadhaar_verified = false;
        }

        /*
        |----------------------------------------------------------------
        | 6. Update database
        |----------------------------------------------------------------
        */
        const updated = await VolunteerModel.updateProfile(volunteerCode, updateData);

        if (!updated) {
            return res.status(500).json({
                success: false,
                message: "Unable to update volunteer profile."
            });
        }

        /*
        |----------------------------------------------------------------
        | 7. Get updated volunteer
        |----------------------------------------------------------------
        */
        const updatedVolunteer = await VolunteerModel.findByCode(volunteerCode);

        /*
        |----------------------------------------------------------------
        | 8. Calculate completion
        |----------------------------------------------------------------
        */
        const completion = calculateVolunteerCompletion(updatedVolunteer);

        /*
        |----------------------------------------------------------------
        | 9. Save completion percentage
        |----------------------------------------------------------------
        */
        await VolunteerModel.updateCompletionPercent(volunteerCode, completion);

        return res.status(200).json({
            success: true,
            message: "Volunteer profile updated successfully.",
            data: {
                volunteer_code: volunteerCode,
                profile_completion_percent: completion,
                status: updatedVolunteer.status
            }
        });
    } catch (error) {
        console.error("COMPLETE VOLUNTEER PROFILE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update volunteer profile."
        });
    }
};

/*
|--------------------------------------------------------------------------
| ADMIN — Approve Volunteer
|--------------------------------------------------------------------------
*/
async function approveVolunteer(req, res) {
    try {
        const { volunteerCode } = req.params;

        const { error, value } = approveVolunteerSchema.validate(
            {
                ...req.body,
                approved_by: req.user?.id || req.body.approved_by || 1
            },
            { abortEarly: false }
        );

        if (error) {
            return ApiResponse.validationError(
                res,
                error.details.map((item) => item.message)
            );
        }

        const volunteer = await VolunteerModel.findByCode(volunteerCode);

        if (!volunteer) {
            return ApiResponse.notFound(res, "Volunteer not found.");
        }

        if (
    volunteer.status !== "APPROVED" &&
    volunteer.status !== "INACTIVE"
) {

    return ApiResponse.validationError(
        res,
        [
            `Volunteer cannot be activated from ${volunteer.status} status.`
        ]
    );

}

        const affectedRows = await VolunteerModel.approveVolunteer(
            volunteerCode,
            value.approved_by
        );

        if (!affectedRows) {
            return ApiResponse.error(res, "Volunteer approval failed.");
        }

        return ApiResponse.success(res, "Volunteer approved successfully.", {
            volunteer_code: volunteerCode,
            status: "APPROVED"
        });
    } catch (error) {
        console.error("❌ Approve volunteer error:", error);

        return ApiResponse.error(res, error.message);
    }
}

/*
|--------------------------------------------------------------------------
| ADMIN — Reject Volunteer
|--------------------------------------------------------------------------
*/
async function rejectVolunteer(req, res) {
    try {
        const { volunteerCode } = req.params;

        const { error, value } = rejectVolunteerSchema.validate(
            {
                ...req.body,
                rejected_by: req.user?.id || req.body.rejected_by || 1
            },
            { abortEarly: false }
        );

        if (error) {
            return ApiResponse.validationError(
                res,
                error.details.map((item) => item.message)
            );
        }

        const volunteer = await VolunteerModel.findByCode(volunteerCode);

        if (!volunteer) {
            return ApiResponse.notFound(res, "Volunteer not found.");
        }

        if (volunteer.status !== "PENDING") {
            return ApiResponse.validationError(res, [
                `Volunteer cannot be rejected from ${volunteer.status} status.`
            ]);
        }

        const affectedRows = await VolunteerModel.rejectVolunteer(
            volunteerCode,
            value.rejected_by,
            value.rejection_reason
        );

        if (!affectedRows) {
            return ApiResponse.error(res, "Volunteer rejection failed.");
        }

        return ApiResponse.success(res, "Volunteer rejected successfully.", {
            volunteer_code: volunteerCode,
            status: "REJECTED"
        });
    } catch (error) {
        console.error("❌ Reject volunteer error:", error);

        return ApiResponse.error(res, error.message);
    }
}

/*
|--------------------------------------------------------------------------
| ADMIN — Activate Volunteer
|--------------------------------------------------------------------------
|
| FIX: previously this only allowed status === "APPROVED", which meant
| there was no way to reactivate a volunteer that had been deactivated
| (status INACTIVE) — clicking "Reactivate" on the frontend always hit
| this guard and failed with a 422. Reactivation now works because
| INACTIVE is an accepted source status alongside the normal APPROVED
| → ACTIVE flow.
|
|--------------------------------------------------------------------------
*/
async function activateVolunteer(req, res) {
    try {
        const { volunteerCode } = req.params;

        const activatedBy = req.user?.id || req.body.activated_by || 1;

        const volunteer = await VolunteerModel.findByCode(volunteerCode);

        if (!volunteer) {
            return ApiResponse.notFound(res, "Volunteer not found.");
        }

        const activatableStatuses = ["APPROVED", "INACTIVE"];

        if (!activatableStatuses.includes(volunteer.status)) {
            return ApiResponse.validationError(res, [
                "Only an approved or inactive volunteer can be activated."
            ]);
        }

        const affectedRows = await VolunteerModel.activateVolunteer(
            volunteerCode,
            activatedBy
        );

        if (!affectedRows) {
            return ApiResponse.error(res, "Volunteer activation failed.");
        }

        return ApiResponse.success(res, "Volunteer activated successfully.", {
            volunteer_code: volunteerCode,
            status: "ACTIVE"
        });
    } catch (error) {
        console.error("❌ Activate volunteer error:", error);

        return ApiResponse.error(res, error.message);
    }
}

/*
|--------------------------------------------------------------------------
| ADMIN — Suspend Volunteer
|--------------------------------------------------------------------------
*/
async function suspendVolunteer(req, res) {
    try {
        const { volunteerCode } = req.params;

        const { error, value } = suspendVolunteerSchema.validate(
            {
                ...req.body,
                updated_by: req.user?.id || req.body.updated_by || 1
            },
            { abortEarly: false }
        );

        if (error) {
            return ApiResponse.validationError(
                res,
                error.details.map((item) => item.message)
            );
        }

        const affectedRows = await VolunteerModel.suspendVolunteer(
            volunteerCode,
            value.updated_by,
            value.reason
        );

        if (!affectedRows) {
            return ApiResponse.validationError(res, [
                "Only an active volunteer can be suspended."
            ]);
        }

        return ApiResponse.success(res, "Volunteer suspended successfully.", {
            volunteer_code: volunteerCode,
            status: "SUSPENDED"
        });
    } catch (error) {
        console.error("❌ Suspend volunteer error:", error);

        return ApiResponse.error(res, error.message);
    }
}

/*
|--------------------------------------------------------------------------
| ADMIN — Deactivate Volunteer
|--------------------------------------------------------------------------
|
| FIX: previously this had no explicit status check — it just called
| VolunteerModel.deactivateVolunteer and treated affectedRows === 0 as
| failure. If that model query's WHERE clause only matches status =
| 'ACTIVE', deactivating a SUSPENDED volunteer silently affects 0 rows
| and fails with a generic 422. We now fetch the volunteer first and
| explicitly allow both ACTIVE and SUSPENDED as valid source statuses,
| matching what the frontend already permits.
|
| NOTE: this only fixes the controller-level guard. If
| VolunteerModel.deactivateVolunteer's SQL still filters strictly to
| status = 'ACTIVE', the SUSPENDED → INACTIVE case will still return
| 0 affected rows and this function will still report failure — the
| model's query needs to accept SUSPENDED as a source status too.
|
|--------------------------------------------------------------------------
*/
async function deactivateVolunteer(req, res) {
    try {
        const { volunteerCode } = req.params;

        const updatedBy = req.user?.id || req.body.updated_by || 1;

        const volunteer = await VolunteerModel.findByCode(volunteerCode);

        if (!volunteer) {
            return ApiResponse.notFound(res, "Volunteer not found.");
        }

        const deactivatableStatuses = ["ACTIVE", "SUSPENDED"];

        if (!deactivatableStatuses.includes(volunteer.status)) {
            return ApiResponse.validationError(res, [
                "Only an active or suspended volunteer can be deactivated."
            ]);
        }

        const affectedRows = await VolunteerModel.deactivateVolunteer(
            volunteerCode,
            updatedBy
        );

        if (!affectedRows) {
            return ApiResponse.validationError(res, [
                "Only an active or suspended volunteer can be deactivated."
            ]);
        }

        return ApiResponse.success(res, "Volunteer deactivated successfully.", {
            volunteer_code: volunteerCode,
            status: "INACTIVE"
        });
    } catch (error) {
        console.error("❌ Deactivate volunteer error:", error);

        return ApiResponse.error(res, error.message);
    }
}

/*
|--------------------------------------------------------------------------
| ADMIN — Archive
|--------------------------------------------------------------------------
*/
async function archiveVolunteer(req, res) {
    try {
        const { volunteerCode } = req.params;

        const archivedBy = req.user?.id || req.body.archived_by || 1;

        const affectedRows = await VolunteerModel.archiveVolunteer(
            volunteerCode,
            archivedBy
        );

        if (!affectedRows) {
            return ApiResponse.notFound(res, "Volunteer not found.");
        }

        return ApiResponse.success(res, "Volunteer archived successfully.");
    } catch (error) {
        console.error("❌ Archive volunteer error:", error);

        return ApiResponse.error(res, error.message);
    }
}

/*
|--------------------------------------------------------------------------
| ADMIN — Restore
|--------------------------------------------------------------------------
*/
async function restoreVolunteer(req, res) {
    try {
        const { volunteerCode } = req.params;

        const updatedBy = req.user?.id || req.body.updated_by || 1;

        const affectedRows = await VolunteerModel.restoreVolunteer(
            volunteerCode,
            updatedBy
        );

        if (!affectedRows) {
            return ApiResponse.notFound(res, "Archived volunteer not found.");
        }

        return ApiResponse.success(res, "Volunteer restored successfully.", {
            volunteer_code: volunteerCode,
            status: "INACTIVE"
        });
    } catch (error) {
        console.error("❌ Restore volunteer error:", error);

        return ApiResponse.error(res, error.message);
    }
}

/*
|--------------------------------------------------------------------------
| ADMIN — List Volunteers
|--------------------------------------------------------------------------
*/
async function listVolunteers(req, res) {
    try {
        console.log("==============================================");
        console.log("ADMIN VOLUNTEER LIST API");

        /*
        |----------------------------------------------------------------
        | Validate Query
        |----------------------------------------------------------------
        */
        const { error, value } = listVolunteerSchema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            return ApiResponse.validationError(
                res,
                error.details.map((item) => item.message)
            );
        }

        /*
        |----------------------------------------------------------------
        | Fetch Volunteers
        |----------------------------------------------------------------
        */
        const result = await VolunteerModel.listVolunteers(value);

        return ApiResponse.success(res, "Volunteers fetched successfully.", result);
    } catch (error) {
        console.error("❌ List volunteers error:", error);

        return ApiResponse.error(res, error.message || "Unable to fetch volunteers.");
    }
}

/*
|--------------------------------------------------------------------------
| Calculate Volunteer Profile Completion
|--------------------------------------------------------------------------
*/
function calculateVolunteerCompletion(volunteer) {
    if (!volunteer) {
        return 0;
    }

    const requiredFields = [
        volunteer.full_name,
        volunteer.date_of_birth,
        volunteer.gender,
        volunteer.address_line1,
        volunteer.pincode,
        volunteer.highest_qualification,
        volunteer.profession,
        volunteer.primary_interest,
        volunteer.preferred_mode,
        volunteer.emergency_contact_name,
        volunteer.emergency_contact_relationship,
        volunteer.emergency_contact_mobile,
        volunteer.aadhaar_hash
    ];

    const completedFields = requiredFields.filter((value) => {
        if (value === null || value === undefined) {
            return false;
        }

        return String(value).trim() !== "";
    }).length;

    const percentage = Math.round((completedFields / requiredFields.length) * 100);

    return Math.min(Math.max(percentage, 0), 100);
}

/*
|--------------------------------------------------------------------------
| ADMIN — Reveal Volunteer Contact
|--------------------------------------------------------------------------
*/
const revealVolunteerContact = async (req, res) => {
    try {
        const { volunteerCode } = req.params;
        const { field } = req.body;

        if (!["email", "mobile"].includes(field)) {
            return res.status(400).json({
                success: false,
                message: "Invalid contact field."
            });
        }

        const volunteer = await VolunteerModel.findByCode(volunteerCode);

        if (!volunteer) {
            return res.status(404).json({
                success: false,
                message: "Volunteer not found."
            });
        }

        let value = null;

        if (field === "email") {
            value = volunteer.email_encrypted
                ? decryptSensitive(volunteer.email_encrypted)
                : null;
        }

        if (field === "mobile") {
            value = volunteer.mobile_encrypted
                ? decryptSensitive(volunteer.mobile_encrypted)
                : null;
        }

        if (!value) {
            return res.status(404).json({
                success: false,
                message: `${field} is not available.`
            });
        }

        return res.status(200).json({
            success: true,
            message: `${field} revealed successfully.`,
            data: {
                field,
                value,
                masked: field === "email" ? maskEmail(value) : maskMobile(value)
            }
        });
    } catch (error) {
        console.error("REVEAL VOLUNTEER CONTACT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to reveal contact information."
        });
    }
};

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/
module.exports = {
    listVolunteers,
    createPublicVolunteer,
    createAdminVolunteer,
    checkAadhaarDuplicate,
    getVolunteer,
    getAdminVolunteer,
    completeVolunteerProfile,
    approveVolunteer,
    rejectVolunteer,
    activateVolunteer,
    suspendVolunteer,
    deactivateVolunteer,
    archiveVolunteer,
    revealVolunteerContact,
    restoreVolunteer
};