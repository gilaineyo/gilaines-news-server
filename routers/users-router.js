const { getUsers, getUserByUsername } = require('../controllers/app.controllers');
const userRouter = require('express').Router();

userRouter.get('/', getUsers)

userRouter
    .route('/:username')
    .get(getUserByUsername)

module.exports = userRouter;