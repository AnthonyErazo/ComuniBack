class MessageRepository {
    constructor(dao){
        this.dao = dao
    }

    getMessages   = async (limit,page,filter) => await this.dao.get(limit,page,filter)
    createMessage = async (newMessage) => await this.dao.create(newMessage)
    deleteMessage = async (mid) => await this.dao.delete(mid)
    response = async (mid,message) => await this.dao.response(mid,message)

}

module.exports = MessageRepository