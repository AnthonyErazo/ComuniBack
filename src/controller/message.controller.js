const { messageService } = require('../repositories');

class MessageController {
    constructor() {
        this.service = messageService
    }

    getMessages = async (req, res) => {
        try {
            const { limit,page,filter } = req.query;
            const response = await this.service.getMessages(limit, page, filter);
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error al traer mensajes:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    addMessage = async (req, res) => {
        try {
            const message=req.body
            const response = await this.service.createMessage(message);
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error agregar mensaje:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    };
    deleteMessage = async (req, res) => {
        try {
            const { mid } = req.params

            const response = await this.service.deleteMessage(mid);
            return res.status(200).json(response)
        } catch (error) {
            console.error('Error al eliminar mensaje:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    responseMessage=async(req,res)=>{
        try {
            const { mid } = req.params;
            const message=req.body
            const response=await this.service.response(mid,message)
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error enviar respuesta:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = MessageController