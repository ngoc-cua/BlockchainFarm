const Shipment = require('../models/shipment');
const Product = require('../models/Products.model');
const ShipmentStatus = require('../models/shipmentStatus');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class ShipmentService {
    // Function to generate a random 12-digit number
    generateRandom12DigitNumber() {
        const min = 100000000000; // Minimum 12-digit number
        const max = 999999999999; // Maximum 12-digit number
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async createShipment(data) {
        try {
            // Generate a unique delivery code
            const deliveryCode = this.generateRandom12DigitNumber().toString();
            const shipmentDate = new Date().toISOString().split('T')[0];

            // Validate product_code
            const product = await Product.findByPk(data.product_code);
            if (!product) {
                throw new Error('Invalid product code');
            }

            // Validate shipment status
            const status = await ShipmentStatus.findByPk(data.status);
            if (!status) {
                throw new Error('Invalid shipment status');
            }

            let imageResult = null;
            if (data.Image) {
                // Upload image to Cloudinary if an image file is provided
                imageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
            }

            // Create shipment in the database
            const shipment = await Shipment.create({
                delivery_code: deliveryCode,
                product_code: data.product_code,
                quantity: data.quantity,
                shipment_date: shipmentDate,
                status: data.status,
                Image: imageResult ? JSON.stringify({ id: imageResult.public_id, url: imageResult.secure_url }) : null
            });
            console.log(shipment)
            return shipment;
        } catch (error) {
             new Error('Error creating shipment:'+error.message);
        }
    }


    async updateShipment(shipmentId, data) {
        try {
            const shipment = await Shipment.findByPk(shipmentId);
            if (!shipment) {
                throw new Error('Shipment not found');
            }

            // Update the shipment fields
            shipment.product_code = data.product_code || shipment.product_code;
            shipment.quantity = data.quantity || shipment.quantity;
            shipment.status = data.status_id || shipment.status;

            // Handle image update
            let imageResult = null;
            if (data.Image) {
                imageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
                shipment.Image = JSON.stringify({ id: imageResult.public_id, url: imageResult.secure_url });
            }

            // Save the updated shipment to the database
            await shipment.save();

            return shipment;
        } catch (error) {
            throw new Error('Error updating shipment: ' + error.message);
        }
    }

    async getShipmentById(shipmentId) {
        try {
            const shipment = await Shipment.findByPk(shipmentId, {
                include: [Product, ShipmentStatus]
            });
            if (!shipment) {
                throw new Error('Shipment not found');
            }

            return shipment;
        } catch (error) {
            throw new Error('Error fetching shipment: ' + error.message);
        }
    }

    async getAllShipments() {
        try {
            const shipments = await Shipment.findAll({
                include: [Product, ShipmentStatus]
            });

            return shipments;
        } catch (error) {
            throw new Error('Error fetching shipments: ' + error.message);
        }
    }

    async deleteShipment(shipmentId) {
        try {
            const shipment = await Shipment.findByPk(shipmentId);
            if (!shipment) {
                throw new Error('Shipment not found');
            }

            // Delete the shipment
            await shipment.destroy();

            return { message: 'Shipment deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting shipment: ' + error.message);
        }
    }
}

module.exports = new ShipmentService();
