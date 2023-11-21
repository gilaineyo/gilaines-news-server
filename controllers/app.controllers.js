const { selectTopics, selectArticle, readEndpoints, selectArticles } = require('../models/app.models')

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((result) => {
        res.status(200).send({ topics: result })
    })
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticle(article_id)
    .then((article) => {
        res.status(200).send({ article: article })
    })
    .catch(next)
}

exports.getEndpoints = (req, res, next) => {
    readEndpoints()
    .then((result) => {
        res.status(200).send({ endpoints: result})
    })
}

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((results) => {
        res.status(200).send({ articles: results })
    })
}