const db = require('../db/connection')
const fs = require('fs/promises')

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => {
        return rows
    })
}

exports.selectArticle = (article_id) => {
    return db.query(`SELECT * FROM articles
        WHERE article_id = $1`, [article_id])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: 'Article does not exist' })
        }
        return rows[0]
    })
}

exports.readEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`)
    .then((result) => {
        const responseBody = JSON.parse(result)
        return responseBody
    })
}

exports.selectArticleComments = (article_id) => {
    return db.query(`SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC
        ;`, [article_id])
    .then(({rows}) => {
        return rows
    })
}

exports.selectArticles = () => {
    return db.query(`SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC
        ;`)
    .then(({rows}) => {
        return rows
    })
}

exports.insertComment = (comment) => {
    const { article_id, username, body } = comment
    return db.query(`INSERT INTO comments (
        body, article_id, author)
        VALUES ($1, $2, $3)
        RETURNING *;`, [ body, article_id, username ])
    .then(({rows}) => {
        return rows[0]
    })
}