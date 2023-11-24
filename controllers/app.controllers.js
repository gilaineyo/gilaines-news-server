const { selectTopics, selectSingleArticle, readEndpoints, selectArticleComments, selectArticles, updateArticle, insertComment, selectUsers, removeComment, updateComment, selectSingleUser, insertNewArticle } = require('../models/app.models')
const { checkArticleExists, checkTopicExists, checkCommentExists } = require('../models/check.models')



exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((result) => {
        res.status(200).send({ topics: result })
    })
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectSingleArticle(article_id)
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
    const { topic, sort_by='created_at', order='desc' } = req.query
    return checkTopicExists(topic)
    .then(() => {
        return selectArticles(topic, sort_by, order)
    })
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


exports.getUsers = (req, res, next) => {
    return selectUsers()
    .then((users) => {
        res.status(200).send({ users: users })
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

exports.patchComment = (req, res, next) => {
    const { comment_id } = req.params
    const { inc_votes } = req.body
    return checkCommentExists(comment_id)
    .then(() => {
        return updateComment(comment_id, inc_votes)
    })
    .then((comment) => {
        res.status(200).send({ comment: comment })
    })
    .catch(next)
}

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params
    return selectSingleUser(username)
    .then((user) => {
        res.status(200).send({ user: user })
    })
    .catch(next)
}

exports.postNewArticle = (req, res, next) => {
    const { author, title, body, topic, article_img_url } = req.body
    return insertNewArticle(author, title, body, topic, article_img_url)
    .then((article) => {
        res.status(201).send({ article: article })
    })
}