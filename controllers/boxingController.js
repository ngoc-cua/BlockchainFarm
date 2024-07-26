const BoxingService = require('../services/BoxingServices');
const ResponseHandler = require('../utils/ErrorHandler');
const { confirmBoxingSchema } = require('../validation/Boxing.validation');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class BoxingController {
    async confirmBoxing(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            // Validate request body against schema
            const { error, value } = confirmBoxingSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            // Check if Image file exists in the request
            if (!req.files || !req.files.Image) {
                return ResponseHandler.badRequest(res, 'Image file is required');
            }

            try {
                // Call BoxingService to confirm the boxing
                const boxingData = {
                    ...value,
                    Image: req.files.Image,
                    Confirmed: true // Assuming boxing is confirmed during creation
                };

                const boxingEntry = await BoxingService.confirmBoxing(boxingData);
                ResponseHandler.success(res, 'Boxing entry confirmed successfully', boxingEntry);
            } catch (error) {
                console.error('Error uploading image or confirming boxing entry:', error);
                ResponseHandler.serverError(res, 'An error occurred while confirming the boxing entry');
            }

        } catch (error) {
            console.error('Error confirming boxing entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while confirming the boxing entry');
        }
    }
}

module.exports = new BoxingController();
