const router = require('express').Router();
const { login, adminLogin } = require("../controllers/AuthController");

router.post('/api/login', login)
router.post('/api/admin/login', adminLogin);

module.exports = router;