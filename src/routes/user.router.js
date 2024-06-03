const { Router } = require('express');
const UserController = require('../controller/user.controller.js');
const { isAdmin, isAuthenticate } = require('../middleware/verifiqueRole.middleware.js');

const {
    deleteUser,
    getDataUser,
    getUserData,
    getUsers,
    updateUser
} = new UserController()

const router = Router();

router
    .get('/',isAdmin,getUsers)
    .get('/data',isAuthenticate,getUserData)
    .get('/:uid', getDataUser)
    .put('/:uid', updateUser)
    .delete('/:uid',isAdmin,deleteUser);

module.exports = router;