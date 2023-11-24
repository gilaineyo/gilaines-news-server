const express = require('express')
const app = express()
const { getTopics, getArticleById, getEndpoints, getArticles, getCommentsByArticle, postComment, patchArticleById, getUsers, deleteComment, patchComment, getUserByUsername } = require('./controllers/app.controllers')
const { handleServerErrors, handleBadPaths, handlePsqlErrors, handleCustomErrors } = require('./error-handlers/errors')

const apiRouter = require('./routers/api-router');

app.use(express.json())

app.use('/api', apiRouter);

app.all('*', handleBadPaths)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app