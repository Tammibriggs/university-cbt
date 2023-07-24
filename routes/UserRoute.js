const express = require("express");
const router = express.Router();
const { verifyAdmin, verifyToken } = require("../middleware/auth");
const { getStudentsOfACourse, generateCoursePasswords, deleteCoursePasswords } = require("../controllers/UserController");

router.get("/api/admin/get-course-students/:courseCode", verifyAdmin, getStudentsOfACourse);
router.post("/api/admin/generate-course-passwords", verifyAdmin, generateCoursePasswords);
router.delete("/api/admin/delete-course-passwords", verifyAdmin, deleteCoursePasswords);

module.exports = router;