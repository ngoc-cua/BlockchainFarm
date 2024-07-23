const FruitBagging = require('../models/fruit_bagging'); // Updated model import
const Product = require('../models/Products.model'); // Assuming Product model remains the same
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class FruitBaggingService {
    async createFruitBagging(data) {
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

            // Create fruit bagging entry in the database
            const fruitBagging = await FruitBagging.create({
                product_code: data.product_code,
                notes: data.notes,
                Image: ImageResult ? JSON.stringify({ id: ImageResult.public_id, url: ImageResult.secure_url }) : null,
            });

            return fruitBagging;
        } catch (error) {
            throw new Error('Error creating fruit bagging entry: ' + error.message);
        }
    }

    async updateFruitBagging(fruitBaggingId, data) {
        try {
            const updatedFruitBagging = await FruitBagging.findByPk(fruitBaggingId);
            if (!updatedFruitBagging) {
                throw new Error('Fruit bagging entry not found');
            }

            // Update the fruit bagging fields
            updatedFruitBagging.notes = data.notes || updatedFruitBagging.notes;

            // Handle image update
            let ImageResult = null;
            if (data.Image) {
                ImageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
                updatedFruitBagging.Image = JSON.stringify({ id: ImageResult.public_id, url: ImageResult.secure_url });
            }

            // Save the updated fruit bagging to the database
            await updatedFruitBagging.save();

            return updatedFruitBagging;
        } catch (error) {
            throw new Error('Error updating fruit bagging entry: ' + error.message);
        }
    }

    async toggleFruitBaggingStatus(fruitBaggingId) {
        try {
            const fruitBagging = await FruitBagging.findByPk(fruitBaggingId);
            if (!fruitBagging) {
                throw new Error('Fruit bagging entry not found');
            }

            // Toggle fruit bagging status between 1 and 2
            fruitBagging.status = fruitBagging.status === 1 ? 2 : 1;

            // Save the updated fruit bagging to the database
            await fruitBagging.save();

            return fruitBagging;
        } catch (error) {
            throw new Error('Error toggling fruit bagging status: ' + error.message);
        }
    }

    async getFruitBaggingByProduct(productCode) {
        try {
            // Find all fruit bagging entries for the given product code
            const fruitBaggings = await FruitBagging.findAll({
                where: { product_code: productCode }
            });

            return fruitBaggings;
        } catch (error) {
            throw new Error('Error fetching fruit bagging entries: ' + error.message);
        }
    }
}

module.exports = new FruitBaggingService();
