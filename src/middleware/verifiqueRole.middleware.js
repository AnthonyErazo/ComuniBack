exports.isAdmin=(req, res, next)=>{
    if (req.user&&req.user.role === 'admin') {
        next()
    } else {
        return res.status(403).send('Access forbidden')
    }
}

exports.isAuthenticate=(req, res, next)=>{
    console.log(req.user)
    if (req.user) {
        next()
    } else {
        return res.status(403).send('Access forbidden')
    }
}
exports.isUser=(req,res,next)=>{
    if (req.user&&req.user.role === 'user') {
        next()
    } else {
        return res.status(403).send('Access forbidden')
    }
}