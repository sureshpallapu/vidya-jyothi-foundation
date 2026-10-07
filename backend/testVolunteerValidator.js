require("dotenv").config();

const {
    publicVolunteerSchema,
    adminVolunteerSchema,
    completeVolunteerProfileSchema
} = require("./validators/volunteerValidator");


console.log("====================================");
console.log("VOLUNTEER VALIDATOR TEST");
console.log("====================================");


/*
|--------------------------------------------------------------------------
| TEST 1 — Valid Public Application
|--------------------------------------------------------------------------
*/

const publicData = {

    full_name:
        "Suresh Test Volunteer",

    email:
        "volunteer.test.2026@example.com",

    mobile:
        "9000012345",

    city:
        "Guntur",

    district:
        "Guntur",

    state:
        "Andhra Pradesh",

    pincode:
        "522001",

    area_of_interest:
        "Education",

    message:
        "I would like to volunteer for student education activities."

};


const publicResult =
    publicVolunteerSchema.validate(
        publicData,
        {
            abortEarly: false
        }
    );


if (publicResult.error) {

    console.error(
        "❌ PUBLIC VALIDATION FAILED"
    );

    console.error(
        publicResult.error.details
            .map(item => item.message)
    );

} else {

    console.log(
        "✅ PUBLIC VALIDATION PASSED"
    );

    console.log(
        publicResult.value
    );

}


/*
|--------------------------------------------------------------------------
| TEST 2 — Invalid Mobile
|--------------------------------------------------------------------------
*/

const invalidData = {

    full_name:
        "Test Volunteer",

    email:
        "invalid-email",

    mobile:
        "12345"

};


const invalidResult =
    publicVolunteerSchema.validate(
        invalidData,
        {
            abortEarly: false
        }
    );


if (invalidResult.error) {

    console.log(
        "===================================="
    );

    console.log(
        "✅ INVALID DATA CORRECTLY REJECTED"
    );

    console.log(
        invalidResult.error.details
            .map(item => item.message)
    );

} else {

    console.error(
        "❌ INVALID DATA WAS ACCEPTED"
    );

}


/*
|--------------------------------------------------------------------------
| TEST 3 — Admin Complete Profile
|--------------------------------------------------------------------------
*/

const adminProfile = {

    full_name:
        "Suresh Test Volunteer",

    alternate_mobile:
        "9000098765",

    city:
        "Guntur",

    district:
        "Guntur",

    state:
        "Andhra Pradesh",

    pincode:
        "522001",

    date_of_birth:
        "2000-12-14",

    gender:
        "MALE",

    aadhaar:
        "999988887777",

    address_line1:
        "Test Address",

    highest_qualification:
        "MCA",

    profession:
        "Software Developer",

    primary_interest:
        "Education",

    preferred_mode:
        "BOTH",

    emergency_contact_name:
        "Test Contact",

    emergency_contact_relationship:
        "Father",

    emergency_contact_mobile:
        "9000011111",

    volunteer_type:
        "PROFESSIONAL",

    updated_by:
        1

};


const adminResult =
    completeVolunteerProfileSchema.validate(
        adminProfile,
        {
            abortEarly: false
        }
    );


if (adminResult.error) {

    console.error(
        "❌ ADMIN PROFILE VALIDATION FAILED"
    );

    console.error(
        adminResult.error.details
            .map(item => item.message)
    );

} else {

    console.log(
        "===================================="
    );

    console.log(
        "✅ ADMIN PROFILE VALIDATION PASSED"
    );

}


console.log(
    "===================================="
);

console.log(
    "VOLUNTEER VALIDATOR TEST COMPLETED"
);

console.log(
    "===================================="
);