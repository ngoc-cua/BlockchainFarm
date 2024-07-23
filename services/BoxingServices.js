const Boxing = require('../models/boxing');
const Shipment = require('../models/shipment');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class BoxingService {
    async createBoxing(data) {
        try {
            // Validate delivery_code
            const shipment = await Shipment.findByPk(data.delivery_code);
            if (!shipment) {
                throw new Error('Invalid delivery code');
            }

            let imageResult = null;
            if (data.Image) {
                // Upload image to Cloudinary if an image file is provided
                imageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
            }

            // Create boxing in the database
            const boxing = await Boxing.create({
                notes: data.notes,
                Image: imageResult ? JSON.stringify({ id: imageResult.public_id, url: imageResult.secure_url }) : null,
                delivery_code: data.delivery_code
            });

            return boxing;
        } catch (error) {
            throw new Error('Error creating boxing: ' + error.message);
        }
    }

    async updateBoxing(id, data) {
        try {
            const boxing = await Boxing.findByPk(id);
            if (!boxing) {
                throw new Error('Boxing not found');
            }

            // Update the boxing fields
            boxing.notes = data.notes || boxing.notes;
            boxing.delivery_code = data.delivery_code || boxing.delivery_code;

            // Handle image update
            let imageResult = null;
            if (data.Image) {
                imageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
                boxing.Image = JSON.stringify({ id: imageResult.public_id, url: imageResult.secure_url });
            }

            // Save the updated boxing to the database
            await boxing.save();

            return boxing;
        } catch (error) {
            throw new Error('Error updating boxing: ' + error.message);
        }
    }

    // async getBoxingById(id) {
    //     try {
    //         const boxing = await Boxing.findByPk(id, {
    //             include: [Shipment]
    //         });
    //         if (!boxing) {
    //             throw new Error('Boxing not found');
    //         }

    //         return boxing;
    //     } catch (error) {
    //         throw new Error('Error fetching boxing: ' + error.message);
    //     }
    // }
   async getAllBoxings() {
        try {
            const boxings = await Boxing.findAll({
                include: [Shipment]
            });

            return boxings;
        } catch (error) {
             Error('Error fetching boxings: ' + error.message);
        }
    }

    async deleteBoxing(id) {
        try {
            const boxing = await Boxing.findByPk(id);
            if (!boxing) {
                throw new Error('Boxing not found');
            }

            // Delete the boxing
            await boxing.destroy();

            return { message: 'Boxing deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting boxing: ' + error.message);
        }
    }
}

module.exports = new BoxingService();
