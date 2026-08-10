const DonationModel = require("../models/donationModel");
const {
    createDonationSchema,
    updateDonationSchema,
} = require("../validators/donationValidator");

const ApiResponse = require("../utils/ApiResponse");

class DonationController {
/*
|--------------------------------------------------------------------------
| Create Donation
|--------------------------------------------------------------------------
*/
async createDonation(req, res) {
    try {

        const { error, value } = createDonationSchema.validate(req.body, {
            abortEarly: false,
        });

        if (error) {
            return ApiResponse.validationError(
                res,
                error.details.map(err => err.message)
            );
        }

        const masterData = await DonationModel.checkMasterData({
            donorId: value.donor_id,
            donationTypeId: value.donation_type_id,
            paymentModeId: value.payment_mode_id
        });

        if (!masterData.success) {
            return ApiResponse.notFound(
                res,
                masterData.message
            );
        }

        const donation = await DonationModel.createDonation(value);

        return ApiResponse.created(
            res,
            "Donation created successfully.",
            donation
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }
}

/*
|--------------------------------------------------------------------------
| Get Donation
|--------------------------------------------------------------------------
*/
async getDonation(req, res) {

    try {

        const donation = await DonationModel.findByCode(req.params.donationCode);

        if (!donation) {
            return ApiResponse.notFound(
                res,
                "Donation not found."
            );
        }

        return ApiResponse.success(
            res,
            "Donation fetched successfully.",
            donation
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

}

/*
|--------------------------------------------------------------------------
| Update Donation
|--------------------------------------------------------------------------
*/

async updateDonation(req, res) {

    try {

        const { error, value } = updateDonationSchema.validate(req.body, {
            abortEarly: false,
        });

        if (error) {
            return ApiResponse.validationError(
                res,
                error.details.map(err => err.message)
            );
        }

        const updated = await DonationModel.updateDonation(
            req.params.donationCode,
            value
        );

        if (!updated) {
            return ApiResponse.notFound(
                res,
                "Donation not found."
            );
        }

        return ApiResponse.success(
            res,
            "Donation updated successfully."
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

}

/*
|--------------------------------------------------------------------------
| List Donations
|--------------------------------------------------------------------------
*/

async listDonations(req, res) {

    try {

        const donations = await DonationModel.listDonations(req.query);

        return ApiResponse.success(
            res,
            "Donations fetched successfully.",
            donations
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

}

/*
|--------------------------------------------------------------------------
| Cancel Donation
|--------------------------------------------------------------------------
*/

async cancelDonation(req, res) {

    try {

      const updatedBy = req.body?.updated_by || 1;

await DonationModel.cancelDonation(
    req.params.donationCode,
    updatedBy
);

        return ApiResponse.success(
            res,
            "Donation cancelled successfully."
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.badRequest(
            res,
            error.message
        );

    }

}


/*
|--------------------------------------------------------------------------
| Archive Donation
|--------------------------------------------------------------------------
*/

async archiveDonation(req, res) {

    try {
const updatedBy = req.body?.updated_by || 1;

await DonationModel.archiveDonation(
    req.params.donationCode,
    updatedBy
);

        return ApiResponse.success(
            res,
            "Donation archived successfully."
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.badRequest(
            res,
            error.message
        );

    }

}


/*
|--------------------------------------------------------------------------
| Restore Donation
|--------------------------------------------------------------------------
*/

async restoreDonation(req, res) {

    try {

        const updatedBy = req.body?.updated_by || 1;

await DonationModel.restoreDonation(
    req.params.donationCode,
    updatedBy
);

        return ApiResponse.success(
            res,
            "Donation restored successfully."
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.badRequest(
            res,
            error.message
        );

    }

}


/*
|--------------------------------------------------------------------------
| Donor Donation History
|--------------------------------------------------------------------------
*/

async donorHistory(req, res) {

    try {

        const history = await DonationModel.donorHistory(req.params.donorId);

        return ApiResponse.success(
            res,
            "Donation history fetched successfully.",
            history
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

}

/*
|--------------------------------------------------------------------------
| Donation Summary
|--------------------------------------------------------------------------
*/

async donationSummary(req, res) {

    try {

        const summary = await DonationModel.donationSummary(req.params.donorId);

        return ApiResponse.success(
            res,
            "Donation summary fetched successfully.",
            summary
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

}

/*
|--------------------------------------------------------------------------
| Donation Statistics
|--------------------------------------------------------------------------
*/

async statistics(req, res) {

    try {

        const statistics = await DonationModel.getStatistics();

        return ApiResponse.success(
            res,
            "Donation statistics fetched successfully.",
            statistics
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

}
/*
|--------------------------------------------------------------------------
| Get Donation Types
|--------------------------------------------------------------------------
*/

async getDonationTypes(req, res) {

    try {

        const donationTypes = await DonationModel.getDonationTypes();

        return ApiResponse.success(
            res,
            "Donation types fetched successfully.",
            donationTypes
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

}

/*
|--------------------------------------------------------------------------
| Get Payment Modes
|--------------------------------------------------------------------------
*/

async getPaymentModes(req, res) {

    try {

        const paymentModes = await DonationModel.getPaymentModes();

        return ApiResponse.success(
            res,
            "Payment modes fetched successfully.",
            paymentModes
        );

    } catch (error) {

        console.error(error);

        return ApiResponse.error(
            res,
            error.message
        );

    }

}

}

module.exports = new DonationController();