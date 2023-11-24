const { getArticles, getArticleById, patchArticleById, getCommentsByArticle, postComment } = require('../controllers/app.controllers');
const articleRouter = require('express').Router();

articleRouter
    .route('/')
    .get(getArticles)

articleRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchArticleById)

articleRouter
    .route('/:article_id/comments')
    .get(getCommentsByArticle)
    .post(postComment)

module.exports = articleRouter