const controller = require('../controllers/menuController');
const authController = require('../controllers/authController');
const router = require('express').Router();

router.get(['/menu', '/menu.html'], controller.zobrazitMenu);
router.post('/menu/favorites', authController.requireAuth, controller.pridatOblibeneJidlo);
router.post('/menu/favorites/:id/delete', authController.requireAuth, controller.odebratOblibeneJidlo);

module.exports = router;
