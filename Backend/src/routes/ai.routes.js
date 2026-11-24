const express = require('express');
const aiController = require("../controllers/ai.controller");

const router = express.Router();

router.post("/get-review", aiController.getReview);
router.get("/models", aiController.getModels);

module.exports = router;
