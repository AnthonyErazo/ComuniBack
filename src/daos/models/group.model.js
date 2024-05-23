const { Schema, model } = require('mongoose');


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
    description: { type: String },
    status: { type: Boolean },
    linkgroup: { type: String },
    notice: [noticeSchema]
});


const groupsModel = model('groups', groupSchema);

module.exports = {
    groupsModel
}