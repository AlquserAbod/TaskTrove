const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const emailVerifyTokenSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
        unique: true
    },
    token : {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 3600 // 1 houre 
    }
},{versionKey: false });

const UserToken = mongoose.model('emailverifytoken',emailVerifyTokenSchema)

module.exports  = UserToken;
