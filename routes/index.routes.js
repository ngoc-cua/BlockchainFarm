const express = require('express');
const userRoutes = require('./User.routes');
const CompanyRoutes = require('./Company.routes');
const AreaRoutes = require('./Area.routes');
const ProductRoutes = require('./Product.routes')
const WateringRoutes = require('./wateringRoutes');
const SowRoutes = require('./sowRoutes');
const FertilizingRoutes = require('./fertilizingRoutes');
const PesticideRoutes = require('./pesticideRoutes');
const PruningRoutes = require('./pruningRoutes');
const Fruit_baggingRoutes = require('./fruit_baggingRoutes');
const HarvestRoutes = require('./harvestRoutes');
const CaringRoutes = require('./caringRoutes');
const ShipmentRoutes = require('./shipmentRoutes');
const BoxingRoutes = require('./boxingRoutes');
const router = express.Router();

router.use('/account', userRoutes);
router.use('/company',CompanyRoutes)
router.use('/area',AreaRoutes)
router.use('/product',ProductRoutes)
router.use('/process', WateringRoutes,
    SowRoutes, FertilizingRoutes, PesticideRoutes,
    PruningRoutes, Fruit_baggingRoutes, HarvestRoutes,CaringRoutes
)
router.use('/shipment',ShipmentRoutes,BoxingRoutes)

module.exports = router;