const { Router } = require('express')
const AuthController = require('../controller/auth.controller.js')

const {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword
} = new AuthController()

const router = Router();

router
    .post('/register', register)
    .post('/login', login)
    .get('/logout', logout)

    .post('/forgot-password',forgotPassword )
    .post('/reset-password/:token',resetPassword );

module.exports = router;