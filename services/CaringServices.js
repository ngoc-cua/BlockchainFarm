const Caring = require('../models/caring'); // Updated model import
const Product = require('../models/Products.model'); // Assuming Product model remains the same
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class CaringService {
    async createCaring(data) {
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

            // Create caring entry in the database
            const caring = await Caring.create({
                product_code: data.product_code,
                notes: data.notes,
                Image: ImageResult ? JSON.stringify({ id: ImageResult.public_id, url: ImageResult.secure_url }) : null,
            });

            return caring;
        } catch (error) {
            throw new Error('Error creating caring entry: ' + error.message);
        }
    }

    async updateCaring(caringId, data) {
        try {
            const updatedCaring = await Caring.findByPk(caringId);
            if (!updatedCaring) {
                throw new Error('Caring entry not found');
            }

            // Update the caring fields
            updatedCaring.notes = data.notes || updatedCaring.notes;

            // Handle image update
            let ImageResult = null;
            if (data.Image) {
                ImageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
                updatedCaring.Image = JSON.stringify({ id: ImageResult.public_id, url: ImageResult.secure_url });
            }

            // Save the updated caring to the database
            await updatedCaring.save();

            return updatedCaring;
        } catch (error) {
            throw new Error('Error updating caring entry: ' + error.message);
        }
    }

    async toggleCaringStatus(caringId) {
        try {
            const caring = await Caring.findByPk(caringId);
            if (!caring) {
                throw new Error('Caring entry not found');
            }

            // Toggle caring status between 1 and 2
            caring.status = caring.status === 1 ? 2 : 1;

            // Save the updated caring to the database
            await caring.save();

            return caring;
        } catch (error) {
            throw new Error('Error toggling caring status: ' + error.message);
        }
    }

    async getCaringByProduct(productCode) {
        try {
            // Find all caring entries for the given product code
            const carings = await Caring.findAll({
                where: { product_code: productCode }
            });

            return carings;
        } catch (error) {
            throw new Error('Error fetching caring entries: ' + error.message);
        }
    }
}

module.exports = new CaringService();
