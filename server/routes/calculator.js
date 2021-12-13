const express = require("express");
router = express.Router();
calculator = require("../controllers/calculator");

// router.post("/calc/", calculator.calculator);
router.get("/calc/", calculator.calculator);

module.exports = router;
