const { getCourseCodes, addCourse, getCourses, changeCourseStatus, deleteCourse, getCourseByCode } = require('../controllers/CourseController');
const { verifyAdmin, verifyToken } = require('../middleware/auth');
const { getCourseById } = require('../controllers/CourseController');
const router = require('express').Router();

router.get('/api/get-course-codes', getCourseCodes)
router.get('/api/admin/courses', verifyAdmin, getCourses)
router.post("/api/admin/add-course", verifyAdmin, addCourse);
router.delete("/api/admin/delete-course", verifyAdmin, deleteCourse);
router.post("/api/admin/course/status", verifyAdmin, changeCourseStatus);
router.get("/api/course/:prop", verifyToken, getCourseById);
router.get("/api/course/code/:courseCode", verifyToken, getCourseByCode);

module.exports = router