const nodeMailer = require('nodemailer');

const mailer = nodeMailer.createTransport({
    host: process.env.MAILER_SMTP,
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    }
});

module.exports = mailer;