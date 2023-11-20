const express = require('express')
const app = express()
const { getTopics, getArticleById } = require('./controllers/app.controllers')
const { handleServerErrors, handleBadPaths } = require('./error-handlers/errors')


app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)

app.all('*', handleBadPaths)

app.use(handleServerErrors)

module.exports = app