require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// ============================================================================
// DATABASE
// ============================================================================

require("./config/db");


// ============================================================================
// EXPRESS APP
// ============================================================================

const app = express();


// ============================================================================
// CORS
// ============================================================================

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);


// ============================================================================
// RAZORPAY WEBHOOK
// ============================================================================
//
// IMPORTANT:
// Razorpay webhook signature verification requires the ORIGINAL RAW BODY.
//
// Therefore:
//
// express.raw()
//       ↓
// Razorpay webhook route
//
// MUST execute BEFORE express.json().
//
// Final webhook URL:
//
// POST /api/webhooks/razorpay
//
// ============================================================================

const razorpayWebhookRoutes =
    require("./routes/razorpayWebhookRoutes");

app.use(
    "/api/webhooks/razorpay",
    express.raw({
        type: "application/json",
        limit: "1mb",
    }),
    razorpayWebhookRoutes
);


// ============================================================================
// JSON BODY PARSER
// ============================================================================
//
// All normal APIs use JSON.
//
// This comes AFTER the Razorpay webhook route intentionally.
// ============================================================================

app.use(
    express.json({
        limit: "10mb",
    })
);


// ============================================================================
// URL ENCODED BODY PARSER
// ============================================================================

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb",
    })
);


// ============================================================================
// STATIC UPLOADS
// ============================================================================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// ============================================================================
// ROUTE IMPORTS
// ============================================================================

// --------------------------------------------------------------------------
// Admin
// --------------------------------------------------------------------------

const adminRoutes =
    require("./routes/adminRoutes");

const adminManagementRoutes =
    require("./routes/adminManagementRoutes");


// --------------------------------------------------------------------------
// Scholarship
// --------------------------------------------------------------------------

const scholarshipRoutes =
    require("./routes/scholarshipRoutes");

const scholarshipCycleRoutes =
    require("./routes/scholarshipCycleRoutes");


// --------------------------------------------------------------------------
// Applications
// --------------------------------------------------------------------------

const applicationRoutes =
    require("./routes/applicationRoutes");

const applicationDetailsRoutes =
    require("./routes/applicationDetailsRoutes");

const applicationWorkflowRoutes =
    require("./routes/applicationWorkflowRoutes");

const applicationHistoryRoutes =
    require("./routes/applicationHistoryRoutes");


// --------------------------------------------------------------------------
// Dashboard
// --------------------------------------------------------------------------

const dashboardRoutes =
    require("./routes/dashboardRoutes");


// --------------------------------------------------------------------------
// Reports
// --------------------------------------------------------------------------

const reportRoutes =
    require("./routes/reportRoutes");


// --------------------------------------------------------------------------
// Settings
// --------------------------------------------------------------------------

const settingsRoutes =
    require("./routes/settingsRoutes");


// --------------------------------------------------------------------------
// Utilities
// --------------------------------------------------------------------------

const pincodeRoutes =
    require("./routes/pincodeRoutes");

const emailVerificationRoutes =
    require("./routes/emailVerificationRoutes");

const ifscRoutes =
    require("./routes/ifscRoutes");

const ocrRoutes =
    require("./routes/ocrRoutes");


// --------------------------------------------------------------------------
// Trust
// --------------------------------------------------------------------------

const trusteeRoutes =
    require("./routes/trusteeRoutes");

const trustDocumentRoutes =
    require("./routes/trustDocumentRoutes");


// --------------------------------------------------------------------------
// Fundraising
// --------------------------------------------------------------------------

const donorRoutes =
    require("./routes/donorRoutes");

const donationRoutes =
    require("./routes/donationRoutes");

const receiptRoutes =
    require("./routes/receiptRoutes");


// --------------------------------------------------------------------------
// Certificates
// --------------------------------------------------------------------------

const certificateRoutes =
    require("./routes/certificateRoutes");


// --------------------------------------------------------------------------
// Public Donation
// --------------------------------------------------------------------------

const publicDonationRoutes =
    require("./routes/publicDonationRoutes");


// ============================================================================
// API ROUTES
// ============================================================================


// --------------------------------------------------------------------------
// Admin
// --------------------------------------------------------------------------

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/admin",
    adminManagementRoutes
);


// --------------------------------------------------------------------------
// Applications
// --------------------------------------------------------------------------

app.use(
    "/api/admin",
    applicationRoutes
);

app.use(
    "/api/admin",
    applicationDetailsRoutes
);

app.use(
    "/api/admin",
    applicationWorkflowRoutes
);

app.use(
    "/api/admin",
    applicationHistoryRoutes
);


// --------------------------------------------------------------------------
// Scholarship
// --------------------------------------------------------------------------

app.use(
    "/api/admin",
    scholarshipCycleRoutes
);

app.use(
    "/api/scholarship",
    scholarshipRoutes
);


// --------------------------------------------------------------------------
// Dashboard
// --------------------------------------------------------------------------

app.use(
    "/api/dashboard",
    dashboardRoutes
);


// --------------------------------------------------------------------------
// Reports
// --------------------------------------------------------------------------

app.use(
    "/api/reports",
    reportRoutes
);


// --------------------------------------------------------------------------
// Settings
// --------------------------------------------------------------------------

app.use(
    "/api/settings",
    settingsRoutes
);


// --------------------------------------------------------------------------
// Utilities
// --------------------------------------------------------------------------

app.use(
    "/api/pincode",
    pincodeRoutes
);

app.use(
    "/api/email",
    emailVerificationRoutes
);

app.use(
    "/api/ifsc",
    ifscRoutes
);

app.use(
    "/api/ocr",
    ocrRoutes
);


// --------------------------------------------------------------------------
// Trust
// --------------------------------------------------------------------------

app.use(
    "/api/trustees",
    trusteeRoutes
);

app.use(
    "/uploads/trustees",
    express.static(
        path.join(
            __dirname,
            "uploads/trustees"
        )
    )
);

app.use(
    "/api/trust-documents",
    trustDocumentRoutes
);


// ============================================================================
// FUNDRAISING
// ============================================================================


// Donor Master
app.use(
    "/api/fundraising/donor-master",
    donorRoutes
);


// Donations
app.use(
    "/api/fundraising/donations",
    donationRoutes
);


// Receipts
app.use(
    "/api/fundraising/receipts",
    receiptRoutes
);


// Certificates
app.use(
    "/api/fundraising/certificates",
    certificateRoutes
);


// ============================================================================
// PUBLIC DONATIONS
// ============================================================================

app.use(
    "/api/public/donations",
    publicDonationRoutes
);


// ============================================================================
// HEALTH / TEST ROUTES
// ============================================================================

app.get(
    "/",
    (req, res) => {

        return res.status(200).send(
            "🚀 Vidya Jyothi Foundation Backend Running"
        );

    }
);


app.get(
    "/api/test",
    (req, res) => {

        return res.status(200).json({

            success: true,

            message:
                "Backend Connected Successfully 🎉",

        });

    }
);


// ============================================================================
// 404 HANDLER
// ============================================================================

app.use(
    (req, res) => {

        return res.status(404).json({

            success: false,

            message:
                "API endpoint not found.",

        });

    }
);


// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================

app.use(
    (err, req, res, next) => {

        console.error(
            "❌ Global Server Error:",
            err
        );

        return res.status(
            err.status || 500
        ).json({

            success: false,

            message:
                err.message ||
                "Internal server error.",

        });

    }
);


// ============================================================================
// START SERVER
// ============================================================================

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    () => {

        console.log(
            `🚀 Server running on port ${PORT}`
        );

    }
);