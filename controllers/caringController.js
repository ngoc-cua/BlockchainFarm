const CaringService = require('../services/CaringServices');
const ResponseHandler = require('../utils/ErrorHandler');
const { createCaringSchema } = require('../validation/Caring.validation');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class CaringController {
    async createCaring(req, res) {
        try {
            // Get token from header
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            // Decode token to get userId
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            // Validate data from body
            const { error, value } = createCaringSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            // Check for image file
            const imageFile = req.files && req.files.Image;

            // Call CaringService to create caring information
            const caringData = {
                ...value,
                Image: imageFile
            };

            const createCaringEntry = CaringService.createCaring(caringData);
            if (!createCaringEntry) {
                return ResponseHandler.notFound(res, 'Caring entry not found or user unauthorized');
            }

            ResponseHandler.success(res, 'Caring entry created successfully', createCaringEntry);

        } catch (error) {
            console.error('Error creating caring entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while creating the caring entry');
        }
    }

    async updateCaring(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { caringId } = req.params;
            if (!caringId) {
                return ResponseHandler.badRequest(res, 'Caring ID is required');
            }

            try {
                // Check if Image file exists in the request
                let imageFile = null;
                if (req.files && req.files.Image) {
                    imageFile = req.files.Image;
                }

                // Call CaringService to update the caring entry
                const caringData = {
                    ...req.body, // Include all fields from the request body
                    Image: imageFile,
                };

                const updatedCaringEntry = await CaringService.updateCaring(caringId, caringData);
                if (!updatedCaringEntry) {
                    return ResponseHandler.notFound(res, 'Caring entry not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Caring entry updated successfully', updatedCaringEntry);
            } catch (error) {
                console.error('Error updating caring entry:', error);
                ResponseHandler.serverError(res, 'An error occurred while updating the caring entry');
            }

        } catch (error) {
            console.error('Error updating caring entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while updating the caring entry');
        }
    }

    async toggleCaringStatus(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { caringId } = req.params;
            if (!caringId) {
                return ResponseHandler.badRequest(res, 'Caring ID is required');
            }

            try {
                const updatedCaringEntry = await CaringService.toggleCaringStatus(caringId);
                if (!updatedCaringEntry) {
                    return ResponseHandler.notFound(res, 'Caring entry not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Caring status toggled successfully', updatedCaringEntry);
            } catch (error) {
                console.error('Error toggling caring status:', error);
                ResponseHandler.serverError(res, 'An error occurred while toggling the caring status');
            }

        } catch (error) {
            console.error('Error toggling caring status:', error);
            ResponseHandler.serverError(res, 'An error occurred while toggling the caring status');
        }
    }

    async getCaringByProduct(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { productCode } = req.params;
            if (!productCode) {
                return ResponseHandler.badRequest(res, 'Product code is required');
            }

            try {
                const caringEntries = await CaringService.getCaringByProduct(productCode);
                if (!caringEntries || caringEntries.length === 0) {
                    return ResponseHandler.notFound(res, 'No caring entries found for this product code');
                }

                ResponseHandler.success(res, 'Caring entries fetched successfully', caringEntries);
            } catch (error) {
                console.error('Error fetching caring entries:', error);
                ResponseHandler.serverError(res, 'An error occurred while fetching caring entries');
            }

        } catch (error) {
            console.error('Error fetching caring entries:', error);
            ResponseHandler.serverError(res, 'An error occurred while fetching caring entries');
        }
    }
}

module.exports = new CaringController();
