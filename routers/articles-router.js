const { getArticles, getArticleById, patchArticleById, getCommentsByArticle, postComment, postNewArticle, deleteArticle } = require('../controllers/app.controllers');
const articleRouter = require('express').Router();

articleRouter
    .route('/')
    .get(getArticles)
    .post(postNewArticle)

articleRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchArticleById)
    .delete(deleteArticle)

articleRouter
    .route('/:article_id/comments')
    .get(getCommentsByArticle)
    .post(postComment)

module.exports = articleRouter