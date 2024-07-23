const express = require('express');
const router = express.Router();
const AreaController = require('../controllers/Area.controller');

// Middleware to protect routes with JWT authentication
const authenticateJWT = require('../utils/authenticateJWT');

// POST /api/areas - Create a new area
router.use(authenticateJWT,)
router.post('/create',  AreaController.createArea);

router.put('/edit/:areaId', AreaController.updateArea);

router.patch('/:areaId/status', AreaController.toggleAreaStatus);

router.get('/list', AreaController.getAllAreas);

module.exports = router;
