const { Router } = require('express');
const MessageController = require('../controller/message.controller');

const {
    getMessages,
    addMessage,
    deleteMessage,
    responseMessage
} = new MessageController()

const router = Router();

router
    .get('/', getMessages)
    .post('/', addMessage)
    .delete('/:mid', deleteMessage)
    .post('/:mid', responseMessage);

module.exports = router;