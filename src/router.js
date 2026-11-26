const express = require('express');
const router = express.Router();

router.use(require('./app/routes/authRouter.js'));
router.use(require('./app/routes/menuRouter.js'));
router.use(express.static('public'));
router.use(require('./app/routes/defaultRouter.js'));

module.exports = router;
