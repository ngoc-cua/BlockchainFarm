const Retailer = require('../models/retailer');
const cloudinary = require('cloudinary').v2;

class RetailerService {
    async confirmRetailer(data) {
        try {
            let imageResult = null;
            if (data.Image) {
                // Upload image to Cloudinary if an image file is provided
                imageResult = await cloudinary.uploader.upload(data.Image.tempFilePath);
            }

            // Create retailer entry in the database
            const retailerEntry = await Retailer.create({
                product_code: data.product_code,
                notes: data.notes,
                Image: imageResult ? JSON.stringify({ id: imageResult.public_id, url: imageResult.secure_url }) : null,
                confirmed: data.Confirmed
            });

            return retailerEntry;
        } catch (error) {
            throw new Error('Error confirming retailer entry: ' + error.message);
        }
    }
}

module.exports = new RetailerService();
