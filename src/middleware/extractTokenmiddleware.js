const { configObject } = require('../config/configObject');
const jwt = require('jsonwebtoken')
exports.extractTokenData = (req, res, next) => {
    const token = req.cookies[configObject.COOKIE_AUTH];
    if (!token) {
        req.user=null
        next()
    }
    try {
        const decoded =jwt.verify(token, configObject.JWT_PRIVATE_KEY);
        req.user=decoded
        next()
    } catch (error) {
        console.error('Error al verificar el token:', error.message )
    }
    
};