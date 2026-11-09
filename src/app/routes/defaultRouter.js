// zavislosti
const controller = require('../controllers/defaultController.js');

// priprava routeru
const router = require('express').Router();

// pokud URL zacina /posts, zpracovava ji specializovany router
router.use('/posts', require('./postsRouter.js'));
// indexova stranka cele aplikace
router.get(['/','/index'], controller.index);
// jakakoli jina URL je chybou
router.use(controller.error);

// exportovani routeru pro pouziti v aplikaci
module.exports = router;
