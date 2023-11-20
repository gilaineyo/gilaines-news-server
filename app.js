const express = require('express')
const app = express()
const { getTopics, handleBadPaths } = require('./controllers/app.controllers')
const { handleServerErrors } = require('./error-handlers/errors')


app.get('/api/topics', getTopics)

app.all('*', handleBadPaths)

app.use(handleServerErrors)

module.exports = app