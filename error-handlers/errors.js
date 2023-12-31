exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === '22P02' || err.code === '23502' || err.code === '23503') {
        res.status(400).send({ msg: 'Bad request'})
    } else if (err.code === '23505') {
        res.status(400).send({ msg: 'Already exists'})
    } else {
        next(err)    
    }
}

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err)
    }
}

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error'})
}

exports.handleBadPaths = (req, res) => {
    res.status(404).send({ msg: 'Path not found' })
}
