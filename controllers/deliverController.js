const DeliverService = require('../services/DeliverServices');
const ResponseHandler = require('../utils/ErrorHandler');
const { confirmDeliverSchema } = require('../validation/Deliver.validation');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class DeliverController {
 async confirmDeliver(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            // Validate request body against schema
            const { error, value } = confirmDeliverSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            // Check if Image file exists in the request
            if (!req.files || !req.files.Image) {
                return ResponseHandler.badRequest(res, 'Image file is required');
            }

            console.log('Image file:', req.files.Image); // Debugging

            try {
                // Call DeliverService to confirm the delivery
                const deliverData = {
                    ...value,
                    Image: req.files.Image,
                    Confirmed: true // Assuming delivery is confirmed during creation
                };

                const deliverEntry = await DeliverService.confirmDeliver(deliverData);
                ResponseHandler.success(res, 'Delivery entry confirmed successfully', deliverEntry);
            } catch (error) {
                console.error('Error uploading image or confirming delivery entry:', error);
                ResponseHandler.serverError(res, 'An error occurred while confirming the delivery entry');
            }

        } catch (error) {
            console.error('Error confirming delivery entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while confirming the delivery entry');
        }
    }
}

module.exports = new DeliverController();
