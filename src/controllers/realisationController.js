'use strict';

const { body, validationResult } = require('express-validator');
const pool = require('../config/database');

async function getRealisations(_req, res) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM realisations ORDER BY sort_order ASC, created_at DESC'
    );

    return res.json(rows);
  } catch (err) {
    console.error('getRealisations error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function getRealisationById(req, res) {
  const { id } = req.params;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM realisations WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Réalisation non trouvée' });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('getRealisationById error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

const realisationValidation = [
  body('name').trim().notEmpty().withMessage('Le nom est requis'),
  body('text').trim().notEmpty().withMessage('Le texte est requis')
];

async function createRealisation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, image, text, sort_order } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO realisations (name, image, text, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [name, image || null, text, sort_order || 0]
    );

    return res.status(201).json({ id: result.insertId, message: 'Réalisation créée' });
  } catch (err) {
    console.error('createRealisation error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function updateRealisation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, image, text, sort_order } = req.body;

  try {
    const [result] = await pool.execute(
      'UPDATE realisations SET name = ?, image = ?, text = ?, sort_order = ?, updated_at = NOW() WHERE id = ?',
      [name, image || null, text, sort_order || 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Réalisation non trouvée' });
    }

    return res.json({ message: 'Réalisation mise à jour' });
  } catch (err) {
    console.error('updateRealisation error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function deleteRealisation(req, res) {
  const { id } = req.params;

  try {
    const [result] = await pool.execute(
      'DELETE FROM realisations WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Réalisation non trouvée' });
    }

    return res.json({ message: 'Réalisation supprimée' });
  } catch (err) {
    console.error('deleteRealisation error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

module.exports = {
  getRealisations,
  getRealisationById,
  realisationValidation,
  createRealisation,
  updateRealisation,
  deleteRealisation
};
