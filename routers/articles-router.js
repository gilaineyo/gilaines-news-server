const { getArticles, getArticleById, patchArticleById, getCommentsByArticle, postComment, postNewArticle } = require('../controllers/app.controllers');
const articleRouter = require('express').Router();

articleRouter
    .route('/')
    .get(getArticles)
    .post(postNewArticle)

articleRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchArticleById)

articleRouter
    .route('/:article_id/comments')
    .get(getCommentsByArticle)
    .post(postComment)

module.exports = articleRouter