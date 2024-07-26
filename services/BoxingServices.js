const  Boxing  = require('../models/boxing');
const cloudinary = require('cloudinary').v2;

class BoxingService {
    async confirmBoxing(data) {
        try {
            let imageResult = null;
            if (data.Image) {
                // Upload image to Cloudinary if an image file is provided
                imageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
            }

            // Create boxing entry in the database
            const boxingEntry = await Boxing.create({
                delivery_code: data.delivery_code,
                notes: data.notes,
                Image: imageResult ? JSON.stringify({ id: imageResult.public_id, url: imageResult.secure_url }) : null,
                confirmed: data.Confirmed
            });

            return boxingEntry;
        } catch (error) {
            throw new Error('Error confirming boxing entry: ' + error.message);
        }
    }
}

module.exports = new BoxingService();
