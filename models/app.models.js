const db = require('../db/connection')
const fs = require('fs/promises')

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => {
        return rows
    })
}

exports.readEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`)
    .then((result) => {
        const responseBody = JSON.parse(result)
        return responseBody
    })
}

exports.selectArticles = () => {
    return db.query(`SELECT articles.author, title, articles.article_id, topic, articles.created_at, article_img_url, COUNT(comments.comment_id) AS comment_count
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