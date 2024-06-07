const nodemailer = require('nodemailer')
const { configObject } = require('../config/configObject')

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: configObject.GMAIL_USER_APP,
        pass: configObject.GMAIL_USER_PASS
    }
})

exports.sendMail = async (destino, subject, html) => {
    try {
        if (!destino) {
            throw new Error('No recipients defined');
        }

        await transport.sendMail({
            from: 'Este mail lo envia <comuni723@gmail.com>',
            to: destino,
            subject,
            html
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
}