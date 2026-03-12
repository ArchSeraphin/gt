'use strict';

require('dotenv').config();

const REQUIRED_ENV = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error('FATAL: ' + key + ' manquant');
    process.exit(1);
  }
}

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const { apiLimiter } = require('./src/middleware/rateLimiter');
const apiRoutes = require('./src/routes/api');
const adminRoutes = require('./src/routes/admin');
const sitemapRoute = require('./src/routes/sitemap');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// Helmet — CSP adaptée
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com', 'https://www.google-analytics.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https://www.google-analytics.com'],
      connectSrc: ["'self'", 'https://www.google-analytics.com', 'https://analytics.google.com']
    }
  },
  hsts: isProd ? { maxAge: 31536000, includeSubDomains: true } : false
}));

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Parsers
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));

// Fichiers statiques
app.use(express.static(path.join(__dirname, 'client', 'dist'), { maxAge: '1d' }));
app.use('/img', express.static(path.join(__dirname, 'img'), { maxAge: '7d' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { maxAge: '7d' }));
app.use('/assets', express.static(path.join(__dirname, 'assets'), { maxAge: '7d' }));

// Rate limiter global API
app.use('/api', apiLimiter);

// Routes
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

// Sitemap & robots.txt
app.use(sitemapRoute);

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(
    'User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://gtpaysage38.fr/sitemap.xml\n'
  );
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    error: isProd ? 'Erreur serveur' : err.message
  });
});

const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, () => {
  console.log(`G&T Paysage — serveur démarré sur le port ${PORT}`);
});

module.exports = app;
