const email = require('nodemailer');


exports.transport = email.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  exports.transporter = email.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'rita.kling31@ethereal.email',
        pass: 'GGApMx4vsCKX9bZbCA'
    }
});