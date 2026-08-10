// const express = require("express");

// const router = express.Router();

// const donorController = require("../controllers/donorController");

// router.get("/", donorController.listDonors);

// router.get("/statistics", donorController.statistics);

// router.get("/:donorCode", donorController.getDonor);

// router.post("/", donorController.createDonor);

// router.put("/:donorCode", donorController.updateDonor);

// router.patch("/:donorCode/archive", donorController.archiveDonor);

// router.patch("/:donorCode/restore", donorController.restoreDonor);

// module.exports = router;


const express = require("express");

const router = express.Router();

const donorController = require("../controllers/donorController");



router.get("/", donorController.listDonors);

router.get("/statistics", donorController.statistics);

router.get("/types", donorController.getDonorTypes);

router.get("/:donorCode", donorController.getDonor);

router.post("/", donorController.createDonor);

router.put("/:donorCode", donorController.updateDonor);

router.patch("/:donorCode/archive", donorController.archiveDonor);

router.patch("/:donorCode/restore", donorController.restoreDonor);

module.exports = router;