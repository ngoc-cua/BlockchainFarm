const Pruning = require('../models/pruning');
const Product = require('../models/Products.model');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class PruningService {
    async createPruning(data) {
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

            // Create pruning entry in the database
            const pruning = await Pruning.create({
                product_code: data.product_code,
                notes: data.notes,
                Image: ImageResult ? JSON.stringify({ id: ImageResult.public_id, url: ImageResult.secure_url }) : null,
            });

            return pruning;
        } catch (error) {
            throw new Error('Error creating pruning entry: ' + error.message);
        }
    }

    async updatePruning(pruningId, data) {
        try {
            const updatedPruning = await Pruning.findByPk(pruningId);
            if (!updatedPruning) {
                throw new Error('Pruning entry not found');
            }

            // Update the pruning fields
            updatedPruning.notes = data.notes || updatedPruning.notes;

            // Handle image update
            let ImageResult = null;
            if (data.Image) {
                ImageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
                updatedPruning.Image = JSON.stringify({ id: ImageResult.public_id, url: ImageResult.secure_url });
            }

            // Save the updated pruning to the database
            await updatedPruning.save();

            return updatedPruning;
        } catch (error) {
            throw new Error('Error updating pruning entry: ' + error.message);
        }
    }

    async togglePruningStatus(pruningId) {
        try {
            const pruning = await Pruning.findByPk(pruningId);
            if (!pruning) {
                throw new Error('Pruning entry not found');
            }

            // Toggle pruning status between 1 and 2
            pruning.status = pruning.status === 1 ? 2 : 1;

            // Save the updated pruning to the database
            await pruning.save();

            return pruning;
        } catch (error) {
            throw new Error('Error toggling pruning status: ' + error.message);
        }
    }

    async getPruningByProduct(productCode) {
        try {
            // Find all pruning entries for the given product code
            const prunings = await Pruning.findAll({
                where: { product_code: productCode }
            });

            return prunings;
        } catch (error) {
            throw new Error('Error fetching pruning entries: ' + error.message);
        }
    }
}

module.exports = new PruningService();
