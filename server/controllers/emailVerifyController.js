const crypto = require('crypto');
const User = require('../Models/user');
const EmailVerifyModel = require('../Models/emailVerifyToken');
const sendEmail = require('../utils/sendEmail');
const { readTemplateParms } = require('../utils/readTemplateParms');
const fs = require('fs');
const path = require('path');

const sendVerificationEmail = async (req, res) => {
    const { user } = req.body;

    if (user.isVerified)
    return res.status(401).json({ error: "email already verified" });

    try {
    let token;
    const existingToken = await EmailVerifyModel.findOne({ userId: user._id });
    
    if(!existingToken) {
        const tokenModel = await new EmailVerifyModel({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex')
        }).save();
        token = tokenModel.token;
    }else {token = existingToken.token}

    // create email template 
    const filePath = path.join(
      process.cwd(),
      process.env.VERCEL_ENV === 'production' ? 'server' : '',
      'public',
      'templates',
      'emailverifytemplate.html'
    );
  
    const template = fs.readFileSync(filePath, 'utf-8');
    const emailTemplate = readTemplateParms(template,{
        username: user.username, 
        'verify-link':  `${process.env.API_URL}/auth/verify/${user._id}/${token}`
    });
    await sendEmail(user.email, "Verify Email", emailTemplate);

    return res.status(200).json({ success: true, message: "email sent successfully" });
    } catch (err) {
    console.error(err);
    return res.status(401).json({ err });
    }
};
  
const verifyEmailLink = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    process.env.APP_URL
    if (!user) return res.redirect(`${process.env.APP_URL}/login?error=` + encodeURIComponent("Invalid token"));

    const token = await EmailVerifyModel.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.redirect(`${process.env.APP_URL}/login?error=` + encodeURIComponent("Invalid token"));

    await user.updateOne({ _id: user._id, isVerified: true });
    await token.deleteOne();

    return res.redirect(`${process.env.APP_URL}/login?message=` + encodeURIComponent('Your email has been verified! you can now log in'));
  } catch (error) {
    console.log(error);
    return res.redirect(`${process.env.APP_URL}/login?error=` + encodeURIComponent("Something went wrong, please try again later"));
  }
};
  
module.exports = {
  sendVerificationEmail,
  verifyEmailLink,
};
