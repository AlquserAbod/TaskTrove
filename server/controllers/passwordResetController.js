const { validationResult } = require('express-validator');
const PasswordResetToken = require("../Models/passwordResetToken")
const crypto = require('crypto');
const User = require('../Models/user');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const sendEmail = require('../utils/sendEmail');
const { readTemplateParms } = require('../utils/readTemplateParms');
const path = require('path');

const forgetPasswordController = async (req, res) => {
    try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false,errors: errors.array() });
        }
        const {email} = req.body;

        let user = await User.findOne({ email: email });

        if (!user)
            return res
                .status(500)
                .send({ success: false, error: "User with given email does not exist!" });

            if(user.googleId != null)
                return res
                    .status(500)
                    .send({ success: false, error: "User with given email used Google authentication. Please reset your password through Google." });
    
        let tokenModel = await PasswordResetToken.findOne({ userId: user._id });
        if (!tokenModel) {
            tokenModel = await new PasswordResetToken({
                userId: user._id,
                token: crypto.randomBytes(64).toString("hex")
            }).save();  
        }
        const token = tokenModel.token;

    
        // create email template 

        const filePath = path.join(
            process.cwd(),
            process.env.VERCEL_ENV === 'production' ? 'server' : '',
            'public',
            'templates',
            'passwordresetemailtemplate.html'
          );
        const template = fs.readFileSync(filePath, 'utf-8');
        const emailTemplate = readTemplateParms(template,{
            username: user.username, 
            'reset-link':  `${process.env.APP_URL}/reset-password/${user._id}/${token}`
        });
        await sendEmail(user.email, "Reset your password", emailTemplate);

    
        return res
            .status(200)
            .json({ success: true, message: "Password reset link sent to your email account" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Something went wrong, please try again later",
            type: ResponseTypes.INTERNAL_ERROR
        });
    }

};
  
const PasswordResetController = async (req,res) => {
    try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {id, token} = req.params;
        const {password} = req.body;


		const user = await User.findOne({ _id: id });
		if (!user) return res.status(400).josn({ success: false, message: "Invalid token" });
        
		const tokenModel = await PasswordResetToken.findOne({
            userId: user._id,
			token: token,
		});
        
		if (!tokenModel) return res.status(400).json({ success: false, message: "Invalid token" });

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        user.password = passwordHash;
        await user.save();
        await tokenModel.deleteOne();
        return res.status(200).json({success: true});
        
	} catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Something went wrong, please try again later",
            type: ResponseTypes.INTERNAL_ERROR
          });
    }
}
  
module.exports = {
    forgetPasswordController,
    PasswordResetController
};
