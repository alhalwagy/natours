const nodemailer = require('nodemailer');
const pug = require('pug');
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Ahmed Alhalwagy <${process.env.EMAIL_FROM}>`;
  }
  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Sendgrid
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  //Send the actual email
  send(template, subject) {
    //1) Render HTML based on pug template
    const html = pug.renderFile(`${__dirname}/../../views/${template}.pug`);
    //2) Define email options
    const mailOptions = {
      from: 'Ahmed Alhalwagy <ahmed@gmail.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      // html:
    };
    //3) create a transport and send email
  }
  sendWelcome() {
    this.send('welcome', 'Welcome to the natours Family!');
  }
};

const sendEmail = async (options) => {
  //1) Create a transporter
  //2) define the email options

  //3)actually send the email
  await transporter.sendMail(mailOptions);
};
