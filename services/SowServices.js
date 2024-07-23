const Sow = require('../models/sow'); // Updated model import
const Product = require('../models/Products.model'); // Assuming Product model remains the same
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class SowService {
    async createSow(data) {
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

            // Create sow entry in the database
            const sow = await Sow.create({
                product_code: data.product_code,
                notes: data.notes,
                Image: ImageResult ? JSON.stringify({ id: ImageResult.public_id, url: ImageResult.secure_url }) : null,
            });

            return sow;
        } catch (error) {
            throw new Error('Error creating sow entry: ' + error.message);
        }
    }

    async updateSow(sowId, data) {
        try {
            const updatedSow = await Sow.findByPk(sowId);
            if (!updatedSow) {
                throw new Error('Sow entry not found');
            }

            // Update the sow fields
            updatedSow.notes = data.notes || updatedSow.notes;

            // Handle image update
            let ImageResult = null;
            if (data.Image) {
                ImageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
                updatedSow.Image = JSON.stringify({ id: ImageResult.public_id, url: ImageResult.secure_url });
            }

            // Save the updated sow to the database
            await updatedSow.save();

            return updatedSow;
        } catch (error) {
            throw new Error('Error updating sow entry: ' + error.message);
        }
    }

    async toggleSowStatus(sowId) {
        try {
            const sow = await Sow.findByPk(sowId);
            if (!sow) {
                throw new Error('Sow entry not found');
            }

            // Toggle sow status between 1 and 2
            sow.status = sow.status === 1 ? 2 : 1;

            // Save the updated sow to the database
            await sow.save();

            return sow;
        } catch (error) {
            throw new Error('Error toggling sow status: ' + error.message);
        }
    }

    async getSowByProduct(productCode) {
        try {
            // Find all sow entries for the given product code
            const sows = await Sow.findAll({
                where: { product_code: productCode }
            });

            return sows;
        } catch (error) {
            throw new Error('Error fetching sow entries: ' + error.message);
        }
    }
}

module.exports = new SowService();
