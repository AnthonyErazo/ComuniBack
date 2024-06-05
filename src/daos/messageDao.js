const { sendMail } = require('../utils/sendMail.js');
const { messageModel } = require('./models/message.model.js');

class MessageDao {
    constructor() {
        this.model = messageModel;
    }
    async get(limit = 10, page = 1, filter) {
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true,
        };
        let parsedQuery = {};
        if (filter) {
            try {
                parsedQuery = JSON.parse(filter);
            } catch (error) {
                throw new Error('Error al filtrar')
            }
        }
        const { docs: payload, ...rest } = await this.model.paginate(parsedQuery, options);

        if (payload.length > 0) {
            return {
                status: "success",
                payload: payload,
                ...rest,
                prevLink: rest.hasPrevPage ? `/user?limit=${limit}&page=${rest.prevPage}` : null,
                nextLink: rest.hasNextPage ? `/user?limit=${limit}&page=${rest.nextPage}` : null,
            };
        } else {
            return {
                status: "success",
                payload: []
            };
        }
    }
    async getBy(filter) {
        let group=await this.model.findOne(filter).lean();
        if (group) {
            return { status: "success", payload: group };
        } else {
            return {
                status: "success",
                payload: []
            };
        }
    }
    async create(newMessage) {
        const allowedProperties=['name','email','message']
        const sanitizedUser = Object.keys(newMessage)
            .filter(key => allowedProperties.includes(key))
            .reduce((obj, key) => {
                obj[key] = newMessage[key];
                return obj;
            }, {});
        await this.model.create(sanitizedUser)
        return { success: "success", payload: "Mensaje enviado" };
    }
    async delete(mid) {
        const messageDelete = await this.model.findOneAndDelete({ _id: mid }).lean()
        if (messageDelete) {
            return { status: "success", message: 'Mensaje eliminado' }
        } else {
            throw new Error('Mensaje no encontrado')
        }
    }
    async response(mid,message) {
        const messageFind=await this.model.findOne({_id:mid}).lean()
        const to=messageFind.email
        const subject='Comuni: Respuesta a tu mensaje'
        const html=`
            <p>${message}</p>
        `
        sendMail(to,subject,html)
        return {status:"success",message:"Mensaje enviado con exito"}
    }
}

exports.MessageMongo = MessageDao;