'use strict';

const { body, validationResult } = require('express-validator');
const pool = require('../config/database');

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const PAGE_SIZE = 9;

async function getArticles(req, res) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  try {
    const [countRows] = await pool.execute(
      'SELECT COUNT(*) AS total FROM articles WHERE published = 1'
    );
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    const [items] = await pool.execute(
      'SELECT id, title, slug, excerpt, cover_image, published_at, created_at FROM articles WHERE published = 1 ORDER BY published_at DESC, created_at DESC LIMIT ? OFFSET ?',
      [PAGE_SIZE, offset]
    );

    return res.json({ items, total, totalPages, page });
  } catch (err) {
    console.error('getArticles error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function getArticleBySlug(req, res) {
  const { slug } = req.params;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM articles WHERE slug = ? AND published = 1',
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('getArticleBySlug error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function getAllArticles(req, res) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  try {
    const [countRows] = await pool.execute(
      'SELECT COUNT(*) AS total FROM articles'
    );
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    const [items] = await pool.execute(
      'SELECT * FROM articles ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [PAGE_SIZE, offset]
    );

    return res.json({ items, total, totalPages, page });
  } catch (err) {
    console.error('getAllArticles error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

const articleValidation = [
  body('title').trim().notEmpty().withMessage('Le titre est requis'),
  body('content').trim().notEmpty().withMessage('Le contenu est requis')
];

async function createArticle(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, excerpt, cover_image, published } = req.body;
  const slug = slugify(title);

  try {
    const publishedAt = published ? new Date() : null;

    const [result] = await pool.execute(
      'INSERT INTO articles (title, slug, excerpt, content, cover_image, published, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [title, slug, excerpt || null, content, cover_image || null, published ? 1 : 0, publishedAt]
    );

    return res.status(201).json({ id: result.insertId, slug, message: 'Article créé' });
  } catch (err) {
    console.error('createArticle error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function updateArticle(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { title, content, excerpt, cover_image, published } = req.body;
  const slug = slugify(title);

  try {
    const [existing] = await pool.execute('SELECT * FROM articles WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    const wasPublished = existing[0].published;
    const publishedAt = (!wasPublished && published) ? new Date() : existing[0].published_at;

    const [result] = await pool.execute(
      'UPDATE articles SET title = ?, slug = ?, excerpt = ?, content = ?, cover_image = ?, published = ?, published_at = ?, updated_at = NOW() WHERE id = ?',
      [title, slug, excerpt || null, content, cover_image || null, published ? 1 : 0, publishedAt, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    return res.json({ message: 'Article mis à jour' });
  } catch (err) {
    console.error('updateArticle error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function toggleArticle(req, res) {
  const { id } = req.params;

  try {
    const [rows] = await pool.execute('SELECT published FROM articles WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    const newStatus = rows[0].published ? 0 : 1;
    const publishedAt = newStatus ? new Date() : null;

    await pool.execute(
      'UPDATE articles SET published = ?, published_at = ?, updated_at = NOW() WHERE id = ?',
      [newStatus, publishedAt, id]
    );

    return res.json({ published: newStatus, message: 'Statut mis à jour' });
  } catch (err) {
    console.error('toggleArticle error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function deleteArticle(req, res) {
  const { id } = req.params;

  try {
    const [result] = await pool.execute('DELETE FROM articles WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    return res.json({ message: 'Article supprimé' });
  } catch (err) {
    console.error('deleteArticle error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

module.exports = {
  getArticles,
  getArticleBySlug,
  getAllArticles,
  articleValidation,
  createArticle,
  updateArticle,
  toggleArticle,
  deleteArticle
};
