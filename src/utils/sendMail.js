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
    return await transport.sendMail({
        from: 'Este mail lo envia <comuni723@gmail.com>',
        to: destino,
        subject,
        html
    })
}