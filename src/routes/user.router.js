const { Router } = require('express');
const UserController = require('../controller/user.controller.js');

const {
    deleteUser,
    getDataUser,
    getUsers,
    updateUser
} = new UserController()

const router = Router();

router
    .get('/', getUsers)
    .get('/:uid', getDataUser)
    .put('/:uid', updateUser)
    .delete('/:uid', deleteUser);

module.exports = router;