const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    avatar:{type: String, required: true},
    rooms:[{room: {type: Types.ObjectId, ref: 'Room'}}]
})

module.exports = model('User', schema)