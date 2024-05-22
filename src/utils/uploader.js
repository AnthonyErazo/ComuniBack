const { configObject } = require('../config/configObject')
const multer = require('multer');
const admin = require('firebase-admin');

const serviceAccount = JSON.parse(configObject.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: configObject.STORAGE_BUCKET
});
const firebaseBucket = admin.storage().bucket();

const uploadToFirebase = async (file) => {
    const filename = `${Date.now()}-${file.originalname}`;
    const fileBuffer = file.buffer;

    const fileRef = firebaseBucket.file(filename);
    const metadata = { contentType: file.mimetype };

    await fileRef.save(fileBuffer, { metadata });

    const url = await fileRef.getSignedUrl({ action: 'read', expires: '01-01-2030' });

    return url;
};

const storageFirebase = multer.memoryStorage();

const uploaderFirebase = multer({
    storage:storageFirebase,
    onError: function (error, next) {
        console.error(error);
        next();
    }
});

module.exports = {
    uploaderFirebase,
    uploadToFirebase
};