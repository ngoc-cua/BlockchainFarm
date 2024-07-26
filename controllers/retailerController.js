const RetailerService = require('../services/RetailerServices');
const ResponseHandler = require('../utils/ErrorHandler');
const { confirmRetailerSchema } = require('../validation/Retailer.validation');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class RetailerController {
    async confirmRetailer(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            // Validate request body against schema
            const { error, value } = confirmRetailerSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            // Check if Image file exists in the request
            if (!req.files || !req.files.Image) {
                return ResponseHandler.badRequest(res, 'Image file is required');
            }

            try {
                // Call RetailerService to confirm the retailer
                const retailerData = {
                    ...value,
                    Image: req.files.Image,
                    Confirmed: true // Assuming retailer is confirmed during creation
                };

                const retailerEntry = await RetailerService.confirmRetailer(retailerData);
                ResponseHandler.success(res, 'Retailer entry confirmed successfully', retailerEntry);
            } catch (error) {
                console.error('Error uploading image or confirming retailer entry:', error);
                ResponseHandler.serverError(res, 'An error occurred while confirming the retailer entry');
            }

        } catch (error) {
            console.error('Error confirming retailer entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while confirming the retailer entry');
        }
    }
}

module.exports = new RetailerController();
