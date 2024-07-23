const Watering = require('../models/watering');
const Product = require('../models/Products.model');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class WateringService {
    async createWatering(data) {
        try {
            // Verify that product code exists
            const product = await Product.findByPk(data.product_code);
            if (!product) {
                throw new Error('Product code is invalid');
            }

            let ImageResult = null;
            if (data.Image) {
                // Upload image to Cloudinary if an image file is provided
                ImageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
            }

            // Create watering entry in the database
            const watering = await Watering.create({
                product_code: data.product_code,
                notes: data.notes,
                Image: ImageResult ? JSON.stringify({ id: ImageResult.public_id, url: ImageResult.secure_url }) : null,
            });

            return watering;
        } catch (error) {
            throw new Error('Error creating watering entry: ' + error.message);
        }
    }
    async updateWatering(wateringId, data) {
        try {
            const updatedWatering = await Watering.findByPk(wateringId);
            if (!updatedWatering) {
                throw new Error('Watering entry not found');
            }

            // Update the watering fields
            updatedWatering.notes = data.notes || updatedWatering.notes;

            // Handle image update
            let ImageResult = null;
            if (data.Image) {
                ImageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
                updatedWatering.Image = JSON.stringify({ id: ImageResult.public_id, url: ImageResult.secure_url });
            }

            // Save the updated watering to the database
            await updatedWatering.save();

            return updatedWatering;
        } catch (error) {
            throw new Error('Error updating watering entry: ' + error.message);
        }
    }

    async toggleWateringStatus(wateringId) {
        try {
            const watering = await Watering.findByPk(wateringId);
            if (!watering) {
                throw new Error('Watering entry not found');
            }

            // Toggle watering status between 1 and 2
            watering.status = watering.status === 1 ? 2 : 1;

            // Save the updated watering to the database
            await watering.save();

            return watering;
        } catch (error) {
            throw new Error('Error toggling watering status: ' + error.message);
        }
    }

    async getWateringByProduct(productCode) {
        try {
            // Find all watering entries for the given product code
            const waterings = await Watering.findAll({
                where: { product_code: productCode }
            });

            return waterings;
        } catch (error) {
            throw new Error('Error fetching watering entries: ' + error.message);
        }
    }
}

module.exports = new WateringService();
