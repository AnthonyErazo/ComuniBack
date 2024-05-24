const { configObject } = require('../config/configObject');
const jwt = require('jsonwebtoken')
exports.extractTokenData = (req, res, next) => {
    const token = res.req.cookies.token;
    console.log(token)
    if (!token) {
        req.user=null
        next()
    }
    try {
        const decoded =jwt.verify(token, configObject.JWT_PRIVATE_KEY);
        req.user=decoded
        console.log(req.user)
        next()
    } catch (error) {
        console.error('Error al verificar el token:', error.message )
    }
    
};