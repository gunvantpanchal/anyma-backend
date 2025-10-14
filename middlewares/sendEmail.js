const nodemailer = require("nodemailer");


const sendEmail = (message, email, subject) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587 || 465,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      text: "details",
      html: `${message}
          `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log("Successfully sent");
        resolve(true);
      }
    });
  });
};

module.exports = { sendEmail };
