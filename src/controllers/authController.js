'use strict';

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');

const IS_PROD = process.env.NODE_ENV === 'production';

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function setCookieOpts(maxAge) {
  return { httpOnly: true, sameSite: 'strict', secure: IS_PROD, maxAge };
}

const loginValidation = [
  body('email').isEmail().withMessage('Adresse email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis')
];

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  try {
    const [rows] = await pool.execute(
      'SELECT id, email, password_hash FROM admins WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password_hash);

    if (!match) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const accessToken = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { adminId: admin.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await pool.execute(
      'INSERT INTO refresh_tokens (admin_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [admin.id, tokenHash, expiresAt]
    );

    res.cookie('accessToken', accessToken, setCookieOpts(15 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, setCookieOpts(7 * 24 * 60 * 60 * 1000));

    return res.json({ message: 'Connexion réussie' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function refresh(req, res) {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const tokenHash = hashToken(refreshToken);

    const [rows] = await pool.execute(
      'SELECT * FROM refresh_tokens WHERE token_hash = ? AND expires_at > NOW()',
      [tokenHash]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      await pool.execute('DELETE FROM refresh_tokens WHERE token_hash = ?', [tokenHash]);
      return res.status(401).json({ error: 'Token invalide' });
    }

    const accessToken = jwt.sign(
      { adminId: payload.adminId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.cookie('accessToken', accessToken, setCookieOpts(15 * 60 * 1000));

    return res.json({ message: 'Token rafraîchi' });
  } catch (err) {
    console.error('Refresh error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function logout(req, res) {
  const { refreshToken } = req.cookies;

  try {
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      await pool.execute('DELETE FROM refresh_tokens WHERE token_hash = ?', [tokenHash]);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.json({ message: 'Déconnexion réussie' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { loginValidation, login, refresh, logout };
