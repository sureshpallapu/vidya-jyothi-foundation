const donorModel = require("../models/donorModel");
const { createDonorSchema, updateDonorSchema } = require("../validators/donorValidator");
const ApiResponse = require("../utils/apiResponse");

class DonorController {

/*
|--------------------------------------------------------------------------
| Get Donor Types
|--------------------------------------------------------------------------
*/

async getDonorTypes(req, res) {

    try {

        const donorTypes = await donorModel.getDonorTypes();

        return ApiResponse.success(
            res,
            "Donor types fetched successfully.",
            donorTypes
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            "Failed to fetch donor types."
        );

    }

}
    /*
    |--------------------------------------------------------------------------
    | Create Donor
    |--------------------------------------------------------------------------
    */

    async createDonor(req, res) {

        try {

            const { error, value } = createDonorSchema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true,
            });

            if (error) {
                return ApiResponse.validation(
                    res,
                    error.details.map(err => err.message)
                );
            }

            const duplicate = await donorModel.checkDuplicate({
                mobile: value.mobile,
                email: value.email,
                panNumber: value.pan_number,
            });

         if (duplicate) {

    let message = "Duplicate donor details found.";

    switch (duplicate.matchedBy) {

        case "PAN":
            message = "This PAN is already linked to another donor.";
            break;

        case "MOBILE":
            message = "This mobile number is already linked to another donor.";
            break;

        case "EMAIL":
            message = "This email address is already linked to another donor.";
            break;

    }

    return ApiResponse.error(
        res,
        message,
        409
    );
}

            const donor = await donorModel.createDonor(value);

            return ApiResponse.success(
                res,
                "Donor created successfully.",
                donor,
                201
            );

        } catch (error) {

            console.error(error);

            return ApiResponse.error(
                res,
                "Failed to create donor."
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Update Donor
    |--------------------------------------------------------------------------
    */

    async updateDonor(req, res) {

        try {

            const { donorCode } = req.params;

            const { error, value } = updateDonorSchema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true,
            });

            if (error) {
                return ApiResponse.validation(
                    res,
                    error.details.map(err => err.message)
                );
            }

            const donor = await donorModel.findByCode(donorCode);

            if (!donor) {
                return ApiResponse.notFound(
                    res,
                    "Donor not found."
                );
            }

            const duplicate = await donorModel.checkDuplicate({
                mobile: value.mobile,
                email: value.email,
                panNumber: value.pan_number,
                excludeId: donor.id,
            });

            if (duplicate) {

    let message = "Duplicate donor details found.";

    switch (duplicate.matchedBy) {

        case "PAN":
            message = "This PAN is already linked to another donor.";
            break;

        case "MOBILE":
            message = "This mobile number is already linked to another donor.";
            break;

        case "EMAIL":
            message = "This email address is already linked to another donor.";
            break;

    }

    return ApiResponse.error(
        res,
        message,
        409
    );
}

            await donorModel.updateDonor(
                donorCode,
                value
            );

            return ApiResponse.success(
                res,
                "Donor updated successfully."
            );

        } catch (error) {

            console.error(error);

            return ApiResponse.error(
                res,
                "Failed to update donor."
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Get Donor
    |--------------------------------------------------------------------------
    */

    async getDonor(req, res) {

        try {

            const donor = await donorModel.findByCode(
                req.params.donorCode
            );

            if (!donor) {
                return ApiResponse.notFound(
                    res,
                    "Donor not found."
                );
            }

            return ApiResponse.success(
                res,
                "Donor fetched successfully.",
                donor
            );

        } catch (error) {

            console.error(error);

            return ApiResponse.error(
                res,
                "Failed to fetch donor."
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | List Donors
    |--------------------------------------------------------------------------
    */

    async listDonors(req, res) {

        try {

            const donors = await donorModel.listDonors({
                page: req.query.page,
                limit: req.query.limit,
                search: req.query.search,
                status: req.query.status,
                donorType: req.query.donorType,
            });

            return ApiResponse.success(
                res,
                "Donors fetched successfully.",
                donors
            );

        } catch (error) {

            console.error(error);

            return ApiResponse.error(
                res,
                "Failed to fetch donors."
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Archive Donor
    |--------------------------------------------------------------------------
    */

    async archiveDonor(req, res) {

        try {

            await donorModel.archiveDonor(
                req.params.donorCode
            );

            return ApiResponse.success(
                res,
                "Donor archived successfully."
            );

        } catch (error) {

            console.error(error);

            return ApiResponse.error(
                res,
                "Failed to archive donor."
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Restore Donor
    |--------------------------------------------------------------------------
    */

    async restoreDonor(req, res) {

        try {

            await donorModel.restoreDonor(
                req.params.donorCode
            );

            return ApiResponse.success(
                res,
                "Donor restored successfully."
            );

        } catch (error) {

            console.error(error);

            return ApiResponse.error(
                res,
                "Failed to restore donor."
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    async statistics(req, res) {

        try {

            const stats = await donorModel.getStatistics();

            return ApiResponse.success(
                res,
                "Statistics fetched successfully.",
                stats
            );

        } catch (error) {

            console.error(error);

            return ApiResponse.error(
                res,
                "Failed to fetch statistics."
            );

        }

    }

}

module.exports = new DonorController();