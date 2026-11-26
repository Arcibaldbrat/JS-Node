// zavislosti
const controller = require('../controllers/postsController.js');
const authController = require('../controllers/authController.js');

// priprava routeru
const router = require('express').Router();

// co se da chtit pomoci URL s posts
//  vsechny URL zacinaly /posts, jinak
//  by nas sem defaultRouter neposlal
router.post('/:id/delete', authController.requireAuth, controller.deletePost);
router.post('/new', authController.requireAuth, controller.addPost);
router.get('/:id', controller.showPost);
router.get('/', controller.allPosts);

// router se da requirnout odjinud
module.exports = router;
