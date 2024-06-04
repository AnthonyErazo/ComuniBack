const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const noticeSchema = new Schema({
    name: { type: String, required: true },
    ref: { type: String, required: true },
}, { _id: false });

const groupSchema = new Schema({
    name: { type: String },
    img: {
        name: { type: String },
        ref: { type: String } 
    },
    background: {
        name: { type: String },
        ref: { type: String } 
    },
    description: { type: String },
    status: { type: Boolean },
    linkFacebook: { type: String },
    linkInstagram: { type: String },
    linkWhatsapp: { type: String },
    notice: [noticeSchema]
});

groupSchema.plugin(mongoosePaginate)

exports.groupsModel = model('groups', groupSchema);
