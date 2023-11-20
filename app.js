const express = require('express')
const app = express()
const { getTopics, getEndpoints, getArticles } = require('./controllers/app.controllers')
const { handleServerErrors, handleBadPaths } = require('./error-handlers/errors')


app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.get('/api/articles', getArticles)

app.all('*', handleBadPaths)

app.use(handleServerErrors)

module.exports = app