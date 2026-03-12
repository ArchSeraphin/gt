'use strict';

const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/auth');
const articleController = require('../controllers/articleController');
const uploadController = require('../controllers/uploadController');
const settingsController = require('../controllers/settingsController');
const realisationController = require('../controllers/realisationController');

// All admin routes require authentication
router.use(requireAuth);

// Articles
router.get('/articles', articleController.getAllArticles);
router.post('/articles', articleController.articleValidation, articleController.createArticle);
router.put('/articles/:id', articleController.articleValidation, articleController.updateArticle);
router.patch('/articles/:id/toggle', articleController.toggleArticle);
router.delete('/articles/:id', articleController.deleteArticle);

// Upload
router.post('/upload', uploadController.multerUpload.single('image'), uploadController.upload);

// Settings
router.get('/settings', settingsController.getSettings);
router.put('/settings', settingsController.settingsValidation, settingsController.updateSettings);

// Realisations
router.get('/realisations', realisationController.getRealisations);
router.post('/realisations', realisationController.realisationValidation, realisationController.createRealisation);
router.put('/realisations/:id', realisationController.realisationValidation, realisationController.updateRealisation);
router.delete('/realisations/:id', realisationController.deleteRealisation);

module.exports = router;
