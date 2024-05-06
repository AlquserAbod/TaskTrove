const nodemailer = require('nodemailer');


async function sendEmail(to,subject,template) {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.USER_PASSWORD,
            },  
        });

        await transporter.sendMail({
            from : "Task Trove",
            to: to,
            subject: subject,
            html: template
        });

    }catch(err) {
        console.error(err);
        throw Error("email not sent")

    }
}

module.exports =  sendEmail