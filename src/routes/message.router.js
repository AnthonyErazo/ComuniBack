const { Router } = require('express');
const MessageController = require('../controller/message.controller');
const { isAdmin } = require('../middleware/verifiqueRole.middleware');

const {
    getMessages,
    addMessage,
    deleteMessage,
    responseMessage
} = new MessageController()

const router = Router();

router
    .get('/',isAdmin, getMessages)
    .post('/', addMessage)
    .delete('/:mid',isAdmin, deleteMessage)
    .post('/:mid',isAdmin, responseMessage);

module.exports = router;