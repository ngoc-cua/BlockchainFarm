const Fertilizing = require('../models/fertilizing'); // Assuming the model is named 'fertilizing'
const Product = require('../models/Products.model');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class FertilizingService {
    async createFertilizing(data) {
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

            // Create fertilizing entry in the database
            const fertilizing = await Fertilizing.create({
                product_code: data.product_code,
                notes: data.notes,
                Image: ImageResult ? JSON.stringify({ id: ImageResult.public_id, url: ImageResult.secure_url }) : null,
            });

            return fertilizing;
        } catch (error) {
            throw new Error('Error creating fertilizing entry: ' + error.message);
        }
    }

    async updateFertilizing(fertilizingId, data) {
        try {
            const updatedFertilizing = await Fertilizing.findByPk(fertilizingId);
            if (!updatedFertilizing) {
                throw new Error('Fertilizing entry not found');
            }

            // Update the fertilizing fields
            updatedFertilizing.notes = data.notes || updatedFertilizing.notes;

            // Handle image update
            let ImageResult = null;
            if (data.Image) {
                ImageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
                updatedFertilizing.Image = JSON.stringify({ id: ImageResult.public_id, url: ImageResult.secure_url });
            }

            // Save the updated fertilizing to the database
            await updatedFertilizing.save();

            return updatedFertilizing;
        } catch (error) {
            throw new Error('Error updating fertilizing entry: ' + error.message);
        }
    }

    async toggleFertilizingStatus(fertilizingId) {
        try {
            const fertilizing = await Fertilizing.findByPk(fertilizingId);
            if (!fertilizing) {
                throw new Error('Fertilizing entry not found');
            }

            // Toggle fertilizing status between 1 and 2
            fertilizing.status = fertilizing.status === 1 ? 2 : 1;

            // Save the updated fertilizing to the database
            await fertilizing.save();

            return fertilizing;
        } catch (error) {
            throw new Error('Error toggling fertilizing status: ' + error.message);
        }
    }

    async getFertilizingByProduct(productCode) {
        try {
            // Find all fertilizing entries for the given product code
            const fertilizings = await Fertilizing.findAll({
                where: { product_code: productCode }
            });

            return fertilizings;
        } catch (error) {
            throw new Error('Error fetching fertilizing entries: ' + error.message);
        }
    }
}

module.exports = new FertilizingService();
