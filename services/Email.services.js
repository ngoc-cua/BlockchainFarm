const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    constructor() {
        // Create a Nodemailer transporter using Gmail
        this.transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          port: process.env.MAIL_PORT,
          secure: false,
          auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
          },
        });
      }

  sendVerificationEmail(email, verificationCode) {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Verify Your Email',
      text: `Your verification code is ${verificationCode}`
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
  }
}

module.exports = new EmailService();
