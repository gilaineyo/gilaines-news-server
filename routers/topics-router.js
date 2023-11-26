const { getTopics, postTopic } = require('../controllers/app.controllers');
const topicRouter = require('express').Router();

topicRouter
    .route('/')
    .get(getTopics)
    .post(postTopic)

module.exports = topicRouter