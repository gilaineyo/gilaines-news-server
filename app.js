const express = require('express')
const app = express()

const { getTopics, getArticleById, getEndpoints, getArticles, getCommentsByArticle } = require('./controllers/app.controllers')
const { handleServerErrors, handleBadPaths, handlePsqlErrors, handleCustomErrors } = require('./error-handlers/errors')


app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsByArticle)

app.get('/api', getEndpoints)

app.get('/api/articles', getArticles)


app.all('*', handleBadPaths)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app