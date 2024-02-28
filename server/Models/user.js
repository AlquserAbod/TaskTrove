const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String,required: true, unique: true},
    email: { type: String,required: true,unique: true},
    password: { type: String, required: true},
    imagePath: {type: String, required: false, default: 'uploads/images/default_avatar.jpg'},
    googleId: { type: String, required: false}, 
    isVerified: {type: Boolean, default: false},
},{timestamps: true, versionKey: false });

const User = mongoose.model('user',userSchema)

// Method to get the image path
userSchema.methods.getImagePath = function () {
    if(this.googleId != null) return this.imagePath

    return `${process.env.SERVER_URL}/${this.imagePath}`
};

module.exports  = User;