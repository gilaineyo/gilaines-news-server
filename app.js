const express = require('express')
const app = express()
const { getTopics } = require('./controllers/app.controllers')
const { handleServerErrors, handleBadPaths } = require('./error-handlers/errors')


app.get('/api/topics', getTopics)

app.all('*', handleBadPaths)

app.use(handleServerErrors)

module.exports = app