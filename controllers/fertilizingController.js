const FertilizingService = require('../services/fertilizingServices'); // Updated service import
const ResponseHandler = require('../utils/ErrorHandler');
const { createFertilizingSchema } = require('../validation/Fertilizing.validation'); // Updated validation import
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class FertilizingController {
    async createFertilizing(req, res) {
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
            const { error, value } = createFertilizingSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            // Check image file
            const imageFile = req.files && req.files.Image;

            // Call FertilizingService to create fertilizing information
            const fertilizingData = {
                ...value,
                Image: imageFile
            };

            const createFertilizingEntry = await FertilizingService.createFertilizing(fertilizingData);
            if (!createFertilizingEntry) {
                return ResponseHandler.notFound(res, 'Fertilizing entry not found or user unauthorized');
            }

            ResponseHandler.success(res, 'Fertilizing entry created successfully', createFertilizingEntry);

        } catch (error) {
            console.error('Error creating fertilizing entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while creating the fertilizing entry');
        }
    }

    async updateFertilizing(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { fertilizingId } = req.params;
            if (!fertilizingId) {
                return ResponseHandler.badRequest(res, 'Fertilizing ID is required');
            }

            try {
                // Check if Image file exists in the request
                let imageFile = null;
                if (req.files && req.files.Image) {
                    imageFile = req.files.Image;
                }

                // Call FertilizingService to update the fertilizing entry
                const fertilizingData = {
                    ...req.body, // Include all fields from the request body
                    Image: imageFile,
                };

                const updatedFertilizingEntry = await FertilizingService.updateFertilizing(fertilizingId, fertilizingData);
                if (!updatedFertilizingEntry) {
                    return ResponseHandler.notFound(res, 'Fertilizing entry not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Fertilizing entry updated successfully', updatedFertilizingEntry);
            } catch (error) {
                console.error('Error updating fertilizing entry:', error);
                ResponseHandler.serverError(res, 'An error occurred while updating the fertilizing entry');
            }

        } catch (error) {
            console.error('Error updating fertilizing entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while updating the fertilizing entry');
        }
    }

    async toggleFertilizingStatus(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { fertilizingId } = req.params;
            if (!fertilizingId) {
                return ResponseHandler.badRequest(res, 'Fertilizing ID is required');
            }

            try {
                const updatedFertilizingEntry = await FertilizingService.toggleFertilizingStatus(fertilizingId);
                if (!updatedFertilizingEntry) {
                    return ResponseHandler.notFound(res, 'Fertilizing entry not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Fertilizing status toggled successfully', updatedFertilizingEntry);
            } catch (error) {
                console.error('Error toggling fertilizing status:', error);
                ResponseHandler.serverError(res, 'An error occurred while toggling the fertilizing status');
            }

        } catch (error) {
            console.error('Error toggling fertilizing status:', error);
            ResponseHandler.serverError(res, 'An error occurred while toggling the fertilizing status');
        }
    }

    async getFertilizingByProduct(req, res) {
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
                const fertilizingEntries = await FertilizingService.getFertilizingByProduct(productCode);
                if (!fertilizingEntries || fertilizingEntries.length === 0) {
                    return ResponseHandler.notFound(res, 'No fertilizing entries found for this product code');
                }

                ResponseHandler.success(res, 'Fertilizing entries fetched successfully', fertilizingEntries);
            } catch (error) {
                console.error('Error fetching fertilizing entries:', error);
                ResponseHandler.serverError(res, 'An error occurred while fetching fertilizing entries');
            }

        } catch (error) {
            console.error('Error fetching fertilizing entries:', error);
            ResponseHandler.serverError(res, 'An error occurred while fetching fertilizing entries');
        }
    }
}

module.exports = new FertilizingController();
