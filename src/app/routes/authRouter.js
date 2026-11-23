const controller = require('../controllers/authController');
const router = require('express').Router();

router.get('/login', controller.loginPage);
router.post('/login', controller.login);
router.get('/register', controller.registerPage);
router.post('/register', controller.register);
router.get('/auth/status', controller.sessionStatus);
router.get('/account', controller.requireAuth, controller.accountPage);
router.post('/logout', controller.requireAuth, controller.logout);
router.post('/account/delete', controller.requireAuth, controller.deleteAccount);

module.exports = router;
