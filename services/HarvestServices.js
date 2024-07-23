const Harvest = require('../models/harvest'); // Updated model import
const Product = require('../models/Products.model'); // Assuming Product model remains the same
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class HarvestService {
    async createHarvest(data) {
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

            // Create harvest entry in the database
            const harvest = await Harvest.create({
                product_code: data.product_code,
                notes: data.notes,
                Image: ImageResult ? JSON.stringify({ id: ImageResult.public_id, url: ImageResult.secure_url }) : null,
            });

            return harvest;
        } catch (error) {
            throw new Error('Error creating harvest entry: ' + error.message);
        }
    }

    async updateHarvest(harvestId, data) {
        try {
            const updatedHarvest = await Harvest.findByPk(harvestId);
            if (!updatedHarvest) {
                throw new Error('Harvest entry not found');
            }

            // Update the harvest fields
            updatedHarvest.notes = data.notes || updatedHarvest.notes;

            // Handle image update
            let ImageResult = null;
            if (data.Image) {
                ImageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
                updatedHarvest.Image = JSON.stringify({ id: ImageResult.public_id, url: ImageResult.secure_url });
            }

            // Save the updated harvest to the database
            await updatedHarvest.save();

            return updatedHarvest;
        } catch (error) {
            throw new Error('Error updating harvest entry: ' + error.message);
        }
    }

    async toggleHarvestStatus(harvestId) {
        try {
            const harvest = await Harvest.findByPk(harvestId);
            if (!harvest) {
                throw new Error('Harvest entry not found');
            }

            // Toggle harvest status between 1 and 2
            harvest.status = harvest.status === 1 ? 2 : 1;

            // Save the updated harvest to the database
            await harvest.save();

            return harvest;
        } catch (error) {
            throw new Error('Error toggling harvest status: ' + error.message);
        }
    }

    async getHarvestByProduct(productCode) {
        try {
            // Find all harvest entries for the given product code
            const harvests = await Harvest.findAll({
                where: { product_code: productCode }
            });

            return harvests;
        } catch (error) {
            throw new Error('Error fetching harvest entries: ' + error.message);
        }
    }
}

module.exports = new HarvestService();
