'use strict';

const express = require('express');
const router = express.Router();
const pool = require('../config/database');

const BASE_URL = 'https://gtpaysage38.fr';

const STATIC_PAGES = [
  '/',
  '/a-propos',
  '/services',
  '/actualites',
  '/contact',
  '/realisations'
];

router.get('/sitemap.xml', async (req, res) => {
  try {
    const [articles] = await pool.query(
      'SELECT slug, updated_at FROM articles WHERE published = 1 ORDER BY published_at DESC'
    );

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const page of STATIC_PAGES) {
      xml += '  <url>\n';
      xml += `    <loc>${BASE_URL}${page}</loc>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    }

    for (const article of articles) {
      xml += '  <url>\n';
      xml += `    <loc>${BASE_URL}/actualites/${article.slug}</loc>\n`;
      if (article.updated_at) {
        xml += `    <lastmod>${new Date(article.updated_at).toISOString().split('T')[0]}</lastmod>\n`;
      }
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.6</priority>\n';
      xml += '  </url>\n';
    }

    xml += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Erreur sitemap:', err.message);
    res.status(500).send('Erreur lors de la génération du sitemap');
  }
});

module.exports = router;
