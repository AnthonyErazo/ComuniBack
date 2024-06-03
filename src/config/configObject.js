const dotenv=require('dotenv')
dotenv.config()
exports.configObject={
    PORT:process.env.PORT,
    DATABASE_MONGO_URL:process.env.DATABASE_MONGO_URL,
    FIREBASE_SERVICE_ACCOUNT:process.env.FIREBASE_SERVICE_ACCOUNT,
    STORAGE_BUCKET:process.env.STORAGE_BUCKET,
    JWT_PRIVATE_KEY:process.env.JWT_PRIVATE_KEY,
    ADMIN_EMAIL:process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD:process.env.ADMIN_PASSWORD,
    COOKIE_AUTH:process.env.COOKIE_AUTH,
    FRONT_URL:process.env.FRONT_URL,
    GMAIL_USER_APP:process.env.GMAIL_USER_APP,
    GMAIL_USER_PASS:process.env.GMAIL_USER_PASS,
}