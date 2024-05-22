const MongoSingleton = require('../utils/mongoSingleton')
const { configObject } = require('./configObject')

exports.connectDb = async () => {
    try{
        MongoSingleton.getInstance(configObject.DATABASE_MONGO_URL)
        console.log("Db connected")
    }catch (err) {
        console.error(err)
    }
}