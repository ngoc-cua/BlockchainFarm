const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  
const Product = require('./Products.model');
const ShipmentStatus = require('./shipmentStatus');

const Shipment = sequelize.define('Shipment', {
    delivery_code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    product_code: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Product, // Tên model Product
            key: 'product_code'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    shipment_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ShipmentStatus,
            key: 'status_id'
        }
    },
    Image: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    tableName: 'Shipments',
    timestamps: false,
    modelName: 'Shipment'
});

module.exports = Shipment;
