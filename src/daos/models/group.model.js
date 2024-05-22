const { Schema, model } = require('mongoose');

const groupSchema = new Schema({
    name: { type: String },
    img:{type:String},
    description: { type: String},
    status:{type: Boolean},
    linkgroup: { type: String},
    notice:[{type:String}]
});


const groupsModel = model('groups', groupSchema);

module.exports = {
    groupsModel
}