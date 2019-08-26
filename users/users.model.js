const mongoose = require('mongoose');

const UserSchema  = new mongoose.Schema({
    email:{
        type: String,
        require: true,
        unique: true,
    },

    password:{
        type: String,
        require: true,
    },

    fullName:{
        type:String,
        require: true,
    },

    createdAt:{
        type:Date,
        default: new Date(),
    }
});
const UsersModel = mongoose.model('User', UserSchema);

module.exports = UsersModel;
