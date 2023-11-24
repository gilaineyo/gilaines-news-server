const express = require('express')
const app = express()
const { getTopics, getArticleById, getEndpoints, getArticles, getCommentsByArticle, postComment, patchArticleById, getUsers, deleteComment, patchComment } = require('./controllers/app.controllers')
const { handleServerErrors, handleBadPaths, handlePsqlErrors, handleCustomErrors } = require('./error-handlers/errors')

app.use(express.json())

app.get('/api', getEndpoints)

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById)
app.patch('/api/articles/:article_id', patchArticleById)

app.get('/api/articles/:article_id/comments', getCommentsByArticle)
app.post('/api/articles/:article_id/comments', postComment)


app.get('/api/users', getUsers)

app.delete('/api/comments/:comment_id', deleteComment)
app.patch('/api/comments/:comment_id', patchComment)

app.all('*', handleBadPaths)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app