const SowService = require('../services/SowServices'); // Update service import
const ResponseHandler = require('../utils/ErrorHandler');
const { createSowSchema } = require('../validation/Sow.validation'); // Update validation import
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class SowController {
    async createSow(req, res) {
        try {
            // Get token from headers
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            // Decode token to get userId
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            // Validate data from body
            const { error, value } = createSowSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            // Check image file
            const imageFile = req.files && req.files.Image;

            // Call SowService to create sow information
            const sowData = {
                ...value,
                Image: imageFile
            };

            const createSowEntry = await SowService.createSow(sowData);
            if (!createSowEntry) {
                return ResponseHandler.notFound(res, 'Sow entry not found or user unauthorized');
            }

            ResponseHandler.success(res, 'Sow entry created successfully', createSowEntry);

        } catch (error) {
            console.error('Error creating sow entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while creating the sow entry');
        }
    }

    async updateSow(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { sowId } = req.params;
            if (!sowId) {
                return ResponseHandler.badRequest(res, 'Sow ID is required');
            }

            try {
                // Check if Image file exists in the request
                let imageFile = null;
                if (req.files && req.files.Image) {
                    imageFile = req.files.Image;
                }

                // Call SowService to update the sow entry
                const sowData = {
                    ...req.body, // Include all fields from the request body
                    Image: imageFile,
                };

                const updatedSowEntry = await SowService.updateSow(sowId, sowData);
                if (!updatedSowEntry) {
                    return ResponseHandler.notFound(res, 'Sow entry not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Sow entry updated successfully', updatedSowEntry);
            } catch (error) {
                console.error('Error updating sow entry:', error);
                ResponseHandler.serverError(res, 'An error occurred while updating the sow entry');
            }

        } catch (error) {
            console.error('Error updating sow entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while updating the sow entry');
        }
    }

    async toggleSowStatus(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { sowId } = req.params;
            if (!sowId) {
                return ResponseHandler.badRequest(res, 'Sow ID is required');
            }

            try {
                const updatedSowEntry = await SowService.toggleSowStatus(sowId);
                if (!updatedSowEntry) {
                    return ResponseHandler.notFound(res, 'Sow entry not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Sow status toggled successfully', updatedSowEntry);
            } catch (error) {
                console.error('Error toggling sow status:', error);
                ResponseHandler.serverError(res, 'An error occurred while toggling the sow status');
            }

        } catch (error) {
            console.error('Error toggling sow status:', error);
            ResponseHandler.serverError(res, 'An error occurred while toggling the sow status');
        }
    }

    async getSowByProduct(req, res) {
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
                const sowEntries = await SowService.getSowByProduct(productCode);
                if (!sowEntries || sowEntries.length === 0) {
                    return ResponseHandler.notFound(res, 'No sow entries found for this product code');
                }

                ResponseHandler.success(res, 'Sow entries fetched successfully', sowEntries);
            } catch (error) {
                console.error('Error fetching sow entries:', error);
                ResponseHandler.serverError(res, 'An error occurred while fetching sow entries');
            }

        } catch (error) {
            console.error('Error fetching sow entries:', error);
            ResponseHandler.serverError(res, 'An error occurred while fetching sow entries');
        }
    }
}

module.exports = new SowController();
