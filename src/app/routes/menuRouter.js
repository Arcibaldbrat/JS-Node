const controller = require('../controllers/menuController');
const router = require('express').Router();

router.get(['/menu', '/menu.html'], controller.zobrazitMenu);
router.post('/menu/favorites', controller.pridatOblibeneJidlo);
router.post('/menu/favorites/:id/delete', controller.odebratOblibeneJidlo);

module.exports = router;
