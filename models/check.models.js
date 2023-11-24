const db = require('../db/connection')

exports.checkArticleExists = (article_id) => {
    return db.query(`SELECT * FROM articles 
        WHERE article_id = $1;`, [article_id])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: 'Article does not exist'})
        }
    })
}

exports.checkTopicExists = (topic) => {
    if (!topic) {
        return Promise.resolve()
    }
    return db.query(`SELECT * FROM topics
        WHERE slug = $1;`, [topic])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: 'Topic does not exist'})
        }
    })
}

exports.checkCommentExists = (comment_id) => {
    return db.query(`SELECT * FROM comments
        WHERE comment_id = $1;`, [comment_id])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({status: 404, msg: 'Comment does not exist'})
        }
    })
}