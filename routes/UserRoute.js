const express = require("express");
const router = express.Router();
const { verifyAdmin, verifyToken } = require("../middleware/auth");
const { getStudentsOfACourse, generateCoursePasswords, deleteCoursePasswords, startExam, saveStudentResult, getResult, getResults } = require("../controllers/UserController");

router.get("/api/admin/get-course-students/:courseCode", verifyAdmin, getStudentsOfACourse);
router.post("/api/admin/generate-course-passwords", verifyAdmin, generateCoursePasswords);
router.delete("/api/admin/delete-course-passwords", verifyAdmin, deleteCoursePasswords);
router.post('/api/start-exam', verifyToken, startExam)
router.post("/api/submit-result", verifyToken, saveStudentResult);
router.get('/api/result/:courseCode', verifyToken, getResult)
router.get('/api/results/:courseCode', verifyAdmin, getResults);

module.exports = router;