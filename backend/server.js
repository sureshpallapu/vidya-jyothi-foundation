const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const db = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const scholarshipRoutes = require("./routes/scholarshipRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const applicationDetailsRoutes = require("./routes/applicationDetailsRoutes");
const applicationWorkflowRoutes = require("./routes/applicationWorkflowRoutes");
const app = express();
const applicationHistoryRoutes =
require("./routes/applicationHistoryRoutes");

const scholarshipCycleRoutes =
require("./routes/scholarshipCycleRoutes");

const adminManagementRoutes =
require("./routes/adminManagementRoutes");

const settingsRoutes = require("./routes/settingsRoutes");
const dashboardRoutes =
  require("./routes/dashboardRoutes");

  const reportRoutes =
  require("./routes/reportRoutes");
/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/admin", adminRoutes);
app.use("/api/admin", applicationRoutes);
app.use("/api/admin", applicationDetailsRoutes);
app.use("/api/admin", applicationWorkflowRoutes);
app.use("/api/scholarship", scholarshipRoutes);
app.use("/api/settings", settingsRoutes);
app.use(
  "/api/admin",
  applicationHistoryRoutes
);
app.use(
  "/api/admin",
  adminManagementRoutes
);
app.use(
  "/api/admin",
  scholarshipCycleRoutes
);
app.use(
  "/api/dashboard",
  dashboardRoutes
);
app.use(
  "/api/reports",
  reportRoutes
);

/*
|--------------------------------------------------------------------------
| Test Routes
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.send("Vidya Jyothi Foundation Backend Running 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend Connected Successfully 🎉",
  });
});

/*
|--------------------------------------------------------------------------
| Server
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});