require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// Initialize Database Connection
require("./config/db");

const app = express();

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(cors());

app.use(
    express.json({
        limit: "10mb",
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb",
    })
);

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

/*
|--------------------------------------------------------------------------
| Route Imports
|--------------------------------------------------------------------------
*/

// Admin
const adminRoutes = require("./routes/adminRoutes");
const adminManagementRoutes = require("./routes/adminManagementRoutes");

// Scholarship
const scholarshipRoutes = require("./routes/scholarshipRoutes");
const scholarshipCycleRoutes = require("./routes/scholarshipCycleRoutes");

// Applications
const applicationRoutes = require("./routes/applicationRoutes");
const applicationDetailsRoutes = require("./routes/applicationDetailsRoutes");
const applicationWorkflowRoutes = require("./routes/applicationWorkflowRoutes");
const applicationHistoryRoutes = require("./routes/applicationHistoryRoutes");

// Dashboard
const dashboardRoutes = require("./routes/dashboardRoutes");

// Reports
const reportRoutes = require("./routes/reportRoutes");

// Settings
const settingsRoutes = require("./routes/settingsRoutes");

// Utilities
const pincodeRoutes = require("./routes/pincodeRoutes");
const emailVerificationRoutes = require("./routes/emailVerificationRoutes");
const ifscRoutes = require("./routes/ifscRoutes");
const ocrRoutes = require("./routes/ocrRoutes");

// Trust
const trusteeRoutes = require("./routes/trusteeRoutes");
const trustDocumentRoutes = require("./routes/trustDocumentRoutes");

// Fundraising (NEW)
const donorRoutes = require("./routes/donorRoutes");
const donationRoutes = require("./routes/donationRoutes");
const receiptRoutes = require("./routes/receiptRoutes");



const certificateRoutes = require("./routes/certificateRoutes");


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Admin
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminManagementRoutes);

// Applications
app.use("/api/admin", applicationRoutes);
app.use("/api/admin", applicationDetailsRoutes);
app.use("/api/admin", applicationWorkflowRoutes);
app.use("/api/admin", applicationHistoryRoutes);

// Scholarship
app.use("/api/admin", scholarshipCycleRoutes);
app.use("/api/scholarship", scholarshipRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

// Reports
app.use("/api/reports", reportRoutes);

// Settings
app.use("/api/settings", settingsRoutes);

// Utilities
app.use("/api/pincode", pincodeRoutes);
app.use("/api/email", emailVerificationRoutes);
app.use("/api/ifsc", ifscRoutes);
app.use("/api/ocr", ocrRoutes);

// Trust
app.use("/api/trustees", trusteeRoutes);

app.use(
    "/uploads/trustees",
    express.static(path.join(__dirname, "uploads/trustees"))
);

app.use("/api/trust-documents", trustDocumentRoutes);

/*
|--------------------------------------------------------------------------
| Fundraising
|--------------------------------------------------------------------------
*/

app.use(
    "/api/fundraising/donor-master",
    donorRoutes
);

app.use(
    "/api/fundraising/donations",
    donationRoutes
);

app.use(
    "/api/fundraising/receipts",
    receiptRoutes
);

app.use(
    "/api/fundraising/certificates",
    certificateRoutes
);

/*
|--------------------------------------------------------------------------
| Test Routes
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
    res.send("🚀 Vidya Jyothi Foundation Backend Running");
});

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend Connected Successfully 🎉",
    });
});

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found.",
    });
});

/*
|--------------------------------------------------------------------------
| Server
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});