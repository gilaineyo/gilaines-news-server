const db = require('../db/connection')
const fs = require('fs/promises')

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => {
        return rows
    })
}

exports.selectSingleArticle = (article_id) => {
    return db.query(`SELECT articles.article_id, articles.author, title, topic, articles.body, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles
        LEFT JOIN comments
        ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`, [article_id])
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

exports.selectArticleComments = (article_id, limit, p) => {
    const offset = limit * (p - 1)
    return db.query(`SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
        ;`, [article_id, limit, offset])
    .then(({rows}) => {
        return rows
    })
}

exports.selectArticles = (topic, sort_by, order, limit, p) => {
    let countQueryString = `SELECT COUNT(*) AS total_count FROM articles ` 
    const countQueryValues = []
    const validQueries = ['title', 'topic', 'author', 'created_at', 'votes', 'article_img_url']
    if (topic) {
        countQueryString += `WHERE articles.topic = $1;`
        countQueryValues.push(topic)
    }
    const countQuery = db.query(countQueryString, countQueryValues)
    const queryValues = []
    let queryString = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON comments.article_id = articles.article_id `    
    if (topic) {
        queryString += `WHERE articles.topic = $1 `
        queryValues.push(topic)
    }
    queryString += `GROUP BY articles.article_id `   
    if (validQueries.includes(sort_by)) {
        queryString += `ORDER BY ${sort_by} `
    } else {
        queryString += `ORDER BY created_at `
    }
    
    if (order === 'asc') {
        queryString += `ASC `
    } else {
        queryString += `DESC `
    }
    const offset = limit * (p - 1)
    queryValues.push(limit)
    queryValues.push(offset)
    if (queryValues.length === 3) {
        queryString += `LIMIT $2 OFFSET $3;`
    } else {
        queryString += `LIMIT $1 OFFSET $2;`
    }
    const articleQuery = db.query(queryString, queryValues)
    return Promise.all([countQuery, articleQuery])
    .then(([countQuery, articleQuery]) => {
        return { total_count: countQuery.rows[0].total_count, articles: articleQuery.rows }
    })
}

exports.updateArticle = (article_id, inc_votes) => {
    return db.query(`UPDATE articles
        SET votes = votes + $2
        WHERE article_id = $1
        RETURNING *;`, [article_id, inc_votes])
    .then(({rows}) => {
        return rows[0]
    })
}

exports.updateComment = (comment_id, inc_votes) => {
    return db.query(`UPDATE comments
        SET votes = votes + $2
        WHERE comment_id = $1
        RETURNING *;`, [comment_id, inc_votes])
    .then(({rows}) => {
        return rows[0]
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

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users;`)
    .then(({rows}) => {
        return rows
    })
}

exports.removeComment = (comment_id) => {
    return db.query(`DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;`, [comment_id])
    .then(({rows}) => {
        if(!rows.length) {
            return Promise.reject({ status: 404, msg: "Comment does not exist"})
        }
        return Promise.resolve()
    })
}

exports.selectSingleUser = (username) => {
    return db.query(`SELECT * FROM users
        WHERE username = $1;`, [username])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: 'User not found'})
        }
        return rows[0]
    })
}

exports.insertNewArticle = (author, title, body, topic, article_img_url) => {
    return db.query(`INSERT INTO articles (
        author, title, body, topic, article_img_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`, [author, title, body, topic, article_img_url])
    .then(({rows}) => {
        const article = rows[0]
        article.comment_count = 0
        return article
    })
}

exports.insertTopic = (slug, description) => {
    return db.query(`INSERT INTO topics (
        slug, description)
        VALUES ($1, $2)
        RETURNING *;`, [slug, description])
    .then(({rows}) => {
        return rows[0]
    })
}

exports.removeArticle = (article_id) => {
    return db.query(`DELETE FROM comments
        WHERE article_id = $1;`, [article_id])
    .then(() => {
        return db.query(`DELETE FROM articles
            WHERE article_id = $1 RETURNING *;`, [article_id])
    })
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: 'Article does not exist' })
        }
        return Promise.resolve()
    })
}