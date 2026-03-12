'use strict';

const express = require('express');
const router = express.Router();

const articleController = require('../controllers/articleController');
const contactController = require('../controllers/contactController');
const authController = require('../controllers/authController');
const settingsController = require('../controllers/settingsController');
const realisationController = require('../controllers/realisationController');
const { contactLimiter, loginLimiter } = require('../middleware/rateLimiter');

// Articles
router.get('/articles', articleController.getArticles);
router.get('/articles/:slug', articleController.getArticleBySlug);

// Contact
router.post('/contact', contactLimiter, contactController.contactValidation, contactController.sendContact);

// Auth
router.post('/auth/login', loginLimiter, authController.loginValidation, authController.login);
router.post('/auth/refresh', authController.refresh);
router.post('/auth/logout', authController.logout);

// Settings
router.get('/settings', settingsController.getPublicSettings);

// Realisations
router.get('/realisations', realisationController.getRealisations);

module.exports = router;
