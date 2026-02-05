const commentController = require('../controllers/comments.controller');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');

//add a new comment
router.post('/addComment', auth, commentController.addComment);
//get comments for a specific event
router.get('/getComments', auth, commentController.getComments);
//delete a comment
router.delete('/deleteComment/:title', auth, commentController.deleteComment);

router.get('/getCommentsByEvent/:eventId', commentController.getCommentsByEvent);

module.exports = router;