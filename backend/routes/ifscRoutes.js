const express = require("express");

const {
  getBankByIfsc,
} = require("../controllers/ifscController");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| IFSC Lookup
|--------------------------------------------------------------------------
*/

router.get(
  "/:ifsc",
  getBankByIfsc
);

module.exports = router;