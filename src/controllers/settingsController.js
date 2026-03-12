'use strict';

const { body, validationResult } = require('express-validator');
const pool = require('../config/database');

const ALLOWED_KEYS = ['ga_measurement_id'];

async function getPublicSettings(_req, res) {
  try {
    const placeholders = ALLOWED_KEYS.map(() => '?').join(', ');
    const [rows] = await pool.execute(
      `SELECT \`key\`, \`value\` FROM settings WHERE \`key\` IN (${placeholders})`,
      ALLOWED_KEYS
    );

    const settings = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    return res.json(settings);
  } catch (err) {
    console.error('getPublicSettings error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function getSettings(_req, res) {
  try {
    const [rows] = await pool.execute('SELECT `key`, `value` FROM settings');

    const settings = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    return res.json(settings);
  } catch (err) {
    console.error('getSettings error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

const settingsValidation = [
  body('key')
    .trim()
    .notEmpty()
    .withMessage('La clé est requise')
    .custom((value) => {
      if (!ALLOWED_KEYS.includes(value)) {
        throw new Error(`Clé non autorisée. Clés valides : ${ALLOWED_KEYS.join(', ')}`);
      }
      return true;
    }),
  body('value').exists().withMessage('La valeur est requise')
];

async function updateSettings(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { key, value } = req.body;

  try {
    await pool.execute(
      'INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)',
      [key, value]
    );

    return res.json({ message: 'Paramètre mis à jour' });
  } catch (err) {
    console.error('updateSettings error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

module.exports = {
  ALLOWED_KEYS,
  getPublicSettings,
  getSettings,
  settingsValidation,
  updateSettings
};
