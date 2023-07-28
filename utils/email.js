const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

const fs = require('fs');

const juice = require('juice');
const path = require('path');

const emailConfig = {
  host: process.env.MAIL_HOST,
  secure: true,
  secureConnection: false,
  tls: {
    ciphers: 'SSLv3',
  },
  port: process.env.MAIL_PORT,
  debug: true,
  connectionTimeout: 10000,
  auth: {
    user: process.env.MAIL_SENDER,
    pass: process.env.MAIL_PASS,
  },
};

const transporter = nodemailer.createTransport(emailConfig);

const renderEmail = (username) => {
  const templateSource = fs.readFileSync(
    path.join(process.cwd(), 'views/email/join.hbs'),
    'utf8'
  );

  const emailTemplate = handlebars.compile(templateSource);

  var replacements = {
    username,
  };

  const htmlToSend = emailTemplate(replacements);

  return htmlToSend;
};

exports.sendJoinUsMailToUser = async (name, to) => {
  const mailOptions = {
    from: {
      name: 'eKalakaar',
      address: process.env.MAIL_SENDER,
    },
    to,
    subject: 'Thank You for Your Interest in eKalakaar!',
    html: renderEmail(name),
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(process.cwd(), 'client/public/assets/icons/logo.png'),
        cid: 'logo',
      },
      {
        filename: 'logo.png',
        path: path.join(
          process.cwd(),
          'client/public/assets/icons/logo-text.png'
        ),
        cid: 'logo-text',
      },
      {
        filename: 'insta.png',
        path: path.join(process.cwd(), 'client/public/assets/icons/insta.png'),
        cid: 'insta',
      },
      {
        filename: 'facebook.png',
        path: path.join(
          process.cwd(),
          'client/public/assets/icons/facebook.png'
        ),
        cid: 'facebook',
      },
      {
        filename: 'linkedin.png',
        path: path.join(
          process.cwd(),
          'client/public/assets/icons/linkedin.png'
        ),
        cid: 'linkedin',
      },
      {
        filename: 'twitter.png',
        path: path.join(
          process.cwd(),
          'client/public/assets/icons/twitter.png'
        ),
        cid: 'twitter',
      },
      {
        filename: 'whatsapp.png',
        path: path.join(
          process.cwd(),
          'client/public/assets/icons/whatsapp.png'
        ),
        cid: 'whatsapp',
      },
      {
        filename: 'youtube.png',
        path: path.join(
          process.cwd(),
          'client/public/assets/icons/youtube.png'
        ),
        cid: 'youtube',
      },
    ],
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return false;
    } else {
      console.log('email send!');
      return true;
    }
  });
};

exports.sendJoinUsMailToAdmin = async (info) => {
  const mailHtml = `
  <h1>${info.full_name} - ${info.subject} - ${new Date(
    info.createdAt
  ).toDateString()}</h1>

  <h2>The details of the email as per template -</h2>

  <p><strong>Name :</strong> ${info.full_name}</p>
  <p><strong>Organization :</strong> ${
    info.organization ? info.organization : 'NA'
  }</p>
  <p><strong>Email Id :</strong> ${info.email}</p>
  <p><strong>Contact No. :</strong> ${info.phone_number}</p>
  <p><strong>Subject :</strong> ${info.subject}</p>
  <p><strong>Message :</strong> ${info.message}</p>
  <p><strong>Link :</strong> ${info.link ? info.link : 'NA'}</p>
  <p><strong>Location :</strong> ${info.location ? info.location : 'NA'}</p>
  <p><strong>Intrested In :</strong> ${
    info.intrestedIn ? info.intrestedIn : 'NA'
  }</p>
  `;

  const mailOptions = {
    from: {
      name: 'eKalakaar',
      address: process.env.MAIL_SENDER,
    },
    to: process.env.MAIL_SENDER,
    subject: info.subject,
    html: mailHtml,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return false;
    } else {
      console.log('email send!');
      return true;
    }
  });
};

exports.sendMail = async (name, subject, email, text, html, attachments) => {
  const mailOptions = {
    from: {
      name: name !== 'eKalakaar' ? 'eKalakaar' : name,
      address: process.env.MAIL_SENDER,
    },
    to: email === undefined ? process.env.MAIL_SENDER : email,
    subject,
    text,
    html: renderEmail(name),
    attachments,
  };

  try {
    const mail = await transporter.sendMail(mailOptions);
    return { ...mail, success: true };
  } catch (error) {
    return error;
  }
};
