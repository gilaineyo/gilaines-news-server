const { selectTopics, selectArticle, readEndpoints, selectArticleComments, selectArticles, updateArticle, insertComment, removeComment } = require('../models/app.models')
const { checkArticleExists } = require('../models/check.models')

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((result) => {
        res.status(200).send({ topics: result })
    })
}

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((results) => {
        res.status(200).send({ articles: results })
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

exports.getCommentsByArticle = (req, res, next) => {
    const { article_id } = req.params
    const commentsPromises = [selectArticleComments(article_id), checkArticleExists(article_id)]
    return Promise.all(commentsPromises)
    .then((resolvedPromises) => {
        const result = resolvedPromises[0]
        res.status(200).send({ comments: result })
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((results) => {
        res.status(200).send({ articles: results })
    })
    .catch(next)
}

exports.patchArticleById = (req, res, next) => {
    const { inc_votes } = req.body
    const { article_id } = req.params
    return checkArticleExists(article_id)
    .then(() => {
        return updateArticle(article_id, inc_votes)
    })
    .then((result) => {
        res.status(200).send({ article: result })
    })
    .catch(next)
}


exports.postComment = (req, res, next) => {
    const comment = req.body
    const { article_id } = req.params
    comment.article_id = article_id
    return checkArticleExists(article_id)
    .then(() => {
        return insertComment(comment)
    })
    .then((result) => {
        res.status(201).send({ comment: result })
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params
    return removeComment(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch(next)
}