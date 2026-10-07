require("dotenv").config();

const VolunteerModel =
    require("./models/volunteerModel");


async function test() {

    try {

        console.log(
            "===================================="
        );

        console.log(
            "VOLUNTEER MODEL TEST"
        );

        console.log(
            "===================================="
        );


        const testEmail =
            `test.volunteer.${Date.now()}@example.com`;


        const result =
            await VolunteerModel.createVolunteer({

                full_name:
                    "Test Volunteer",

                email:
                    testEmail,

                mobile:
                    "9876543210",

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
                    "Test volunteer registration",

                application_source:
                    "PUBLIC"

            });


        console.log(
            "===================================="
        );

        console.log(
            "✅ VOLUNTEER CREATED"
        );

        console.log(
            result
        );

        console.log(
            "===================================="
        );


        /*
        |--------------------------------------------------------------------------
        | Find Volunteer
        |--------------------------------------------------------------------------
        */

        const volunteer =
            await VolunteerModel.findByCode(
                result.volunteer_code
            );


        if (!volunteer) {

            throw new Error(
                "Volunteer could not be retrieved."
            );

        }


        console.log(
            "✅ VOLUNTEER FOUND"
        );

        console.log(
            "Volunteer Code:",
            volunteer.volunteer_code
        );

        console.log(
            "Status:",
            volunteer.status
        );

        console.log(
            "Application Source:",
            volunteer.application_source
        );


        /*
        |--------------------------------------------------------------------------
        | Safe Profile
        |--------------------------------------------------------------------------
        */

        const safeProfile =
            await VolunteerModel.getSafeProfile(
                result.volunteer_code
            );


        console.log(
            "===================================="
        );

        console.log(
            "✅ SAFE PROFILE"
        );

        console.log(
            safeProfile
        );

        console.log(
            "===================================="


        );

    } catch (error) {

        console.error(
            "❌ VOLUNTEER MODEL TEST FAILED"
        );

        console.error(
            error.message
        );

        console.error(
            error
        );

        process.exitCode = 1;

    }

}


test();