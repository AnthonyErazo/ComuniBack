const { Router } = require('express')
const authRouter = require('./auth.router.js')
const groupRouter = require('./groups.router.js')
const userRouter = require('./user.router.js')

const router = Router();

router.use('/api/users', userRouter);
router.use('/api/groups', groupRouter);
router.use('/api/auth',authRouter );

module.exports = router