const { selectTopics } = require('../models/app.models')

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((result) => {
        res.status(200).send({ topics: result })
    })
}

exports.handleBadPaths = (req, res) => {
    res.status(404).send({ msg: 'Path not found' })
}