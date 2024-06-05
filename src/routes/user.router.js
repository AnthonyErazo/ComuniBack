const { Router } = require('express');
const UserController = require('../controller/user.controller.js');
const { isAdmin, isAuthenticate, isUser } = require('../middleware/verifiqueRole.middleware.js');

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
    .put('/',isUser,updateUser)
    .delete('/:uid',isAdmin,deleteUser);

module.exports = router;