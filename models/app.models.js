const db = require('../db/connection')
const fs = require('fs/promises')

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`)
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