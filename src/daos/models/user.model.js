const { Schema, model } = require('mongoose')
const mongososePaginate = require('mongoose-paginate-v2')

const usersSchema = Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    group:{type:Schema.Types.ObjectId,ref:'groups'}
})


usersSchema.pre('findOne',function () {
    this.populate('group')
})

usersSchema.plugin(mongososePaginate)

exports.usersModel = model('user', usersSchema)