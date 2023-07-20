const { getCourseCodes } = require('../controllers/CourseController');
const router = require('express').Router();

router.get('/api/get-course-codes', getCourseCodes)

module.exports = router