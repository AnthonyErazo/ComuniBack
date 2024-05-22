const { Router } = require('express')
const { uploadToFirebase,uploaderFirebase } = require('../utils/uploader.js')
const jwt = require('jsonwebtoken');
const { configObject } = require('../config/configObject.js')
const authRouter = require('./auth.router.js')
const groupRouter = require('./groups.router.js')
const userRouter = require('./user.router.js')

const router = Router();

router.post('/upload-to-firebase',uploaderFirebase.array('file'), async (req, res) => {
    try {
        const files = req.files;
        let urls = [];
        
        for (const file of files) {
            const url = await uploadToFirebase(file);
            urls=[...urls,url[0]]
        }

        res.json({ urls });
    } catch (error) {
        console.error('Error al subir la imagen a Firebase:', error);
        res.status(500).json({ message: 'Error al subir la imagen a Firebase' });
    }
});



router.get('/extractToken', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }
    try {
        const decodedToken = jwt.verify(token, configObject.JWT_PRIVATE_KEY);
        res.req.user=decodedToken
        res.json(decodedToken);
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
});

router.use('/api/users', userRouter);
router.use('/api/groups', groupRouter);
router.use('/api/auth',authRouter );

module.exports = router