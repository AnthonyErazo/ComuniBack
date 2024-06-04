const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const messageSchema = new Schema({
    name: { type: String, require },
    email: { type: String, require },
    message: { type: String, require }
});

messageSchema.plugin(mongoosePaginate)

exports.messageModel = model('message', messageSchema);
