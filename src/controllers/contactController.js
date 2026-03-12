'use strict';

const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Adresse email invalide'),
  body('phone').trim().notEmpty().withMessage('Le téléphone est requis'),
  body('message').trim().notEmpty().withMessage('Le message est requis')
];

async function sendContact(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, message } = req.body;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background-color: #2d5a27; color: #ffffff; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; }
    .body { padding: 24px; }
    .field { margin-bottom: 16px; }
    .field-label { font-weight: bold; color: #555555; font-size: 13px; text-transform: uppercase; margin-bottom: 4px; }
    .field-value { color: #333333; font-size: 15px; line-height: 1.5; }
    .message-box { background-color: #f9f9f9; border-left: 4px solid #2d5a27; padding: 16px; margin-top: 8px; white-space: pre-wrap; }
    .footer { text-align: center; padding: 16px; font-size: 12px; color: #999999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Nouveau message de contact</h1>
    </div>
    <div class="body">
      <div class="field">
        <div class="field-label">Nom</div>
        <div class="field-value">${escapeHtml(name)}</div>
      </div>
      <div class="field">
        <div class="field-label">Email</div>
        <div class="field-value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
      </div>
      <div class="field">
        <div class="field-label">Téléphone</div>
        <div class="field-value">${escapeHtml(phone)}</div>
      </div>
      <div class="field">
        <div class="field-label">Message</div>
        <div class="message-box">${escapeHtml(message)}</div>
      </div>
    </div>
    <div class="footer">
      Ce message a été envoyé depuis le formulaire de contact du site G&amp;T Paysage.
    </div>
  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"G&T Paysage" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO,
      replyTo: email,
      subject: `Nouveau message de ${name}`,
      html: htmlContent
    });

    return res.json({ message: 'Message envoyé avec succès' });
  } catch (err) {
    console.error('sendContact error:', err);
    return res.status(500).json({ message: "Erreur lors de l'envoi du message" });
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

module.exports = {
  contactValidation,
  sendContact
};
