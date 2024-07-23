// routes/company.routes.js
const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/Company.controller');

// PUT /api/company/:id
router.put('/edit', CompanyController.updateCompany);

module.exports = router;
