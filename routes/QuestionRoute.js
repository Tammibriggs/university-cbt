const express = require("express");
const router = express.Router();
const {
  addQuestions,
  getQuestions,
  adminGetQuestions,
} = require("../controllers/QuestionController");
const { verifyAdmin, verifyToken } = require("../middleware/auth");

router.post("/api/admin/add-questions", verifyAdmin, addQuestions);
router.get("/api/admin/questions/:courseId", verifyAdmin, adminGetQuestions);
router.get("/api/questions/:courseId", verifyToken, getQuestions);

module.exports = router;