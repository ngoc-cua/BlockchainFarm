const Pesticide = require('../models/pesticide');
const Product = require('../models/Products.model');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class PesticideService {
    async createPesticide(data) {
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

            // Create pesticide entry in the database
            const pesticide = await Pesticide.create({
                product_code: data.product_code,
                notes: data.notes,
                Image: ImageResult ? JSON.stringify({ id: ImageResult.public_id, url: ImageResult.secure_url }) : null,
            });

            return pesticide;
        } catch (error) {
            throw new Error('Error creating pesticide entry: ' + error.message);
        }
    }

    async updatePesticide(pesticideId, data) {
        try {
            const updatedPesticide = await Pesticide.findByPk(pesticideId);
            if (!updatedPesticide) {
                throw new Error('Pesticide entry not found');
            }

            // Update the pesticide fields
            updatedPesticide.notes = data.notes || updatedPesticide.notes;

            // Handle image update
            let ImageResult = null;
            if (data.Image) {
                ImageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
                updatedPesticide.Image = JSON.stringify({ id: ImageResult.public_id, url: ImageResult.secure_url });
            }

            // Save the updated pesticide to the database
            await updatedPesticide.save();

            return updatedPesticide;
        } catch (error) {
            throw new Error('Error updating pesticide entry: ' + error.message);
        }
    }

    async togglePesticideStatus(pesticideId) {
        try {
            const pesticide = await Pesticide.findByPk(pesticideId);
            if (!pesticide) {
                throw new Error('Pesticide entry not found');
            }

            // Toggle pesticide status between 1 and 2
            pesticide.status = pesticide.status === 1 ? 2 : 1;

            // Save the updated pesticide to the database
            await pesticide.save();

            return pesticide;
        } catch (error) {
            throw new Error('Error toggling pesticide status: ' + error.message);
        }
    }

    async getPesticideByProduct(productCode) {
        try {
            // Find all pesticide entries for the given product code
            const pesticides = await Pesticide.findAll({
                where: { product_code: productCode }
            });

            return pesticides;
        } catch (error) {
            throw new Error('Error fetching pesticide entries: ' + error.message);
        }
    }
}

module.exports = new PesticideService();
