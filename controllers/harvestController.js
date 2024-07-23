const HarvestService = require('../services/HarvestServices');
const ResponseHandler = require('../utils/ErrorHandler');
const { createHarvestSchema } = require('../validation/Harvest.validation');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class HarvestController {
    async createHarvest(req, res) {
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
            const { error, value } = createHarvestSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            // Check for image file
            const imageFile = req.files && req.files.Image;

            // Call HarvestService to create harvest information
            const harvestData = {
                ...value,
                Image: imageFile
            };

            const createHarvestEntry = await HarvestService.createHarvest(harvestData);
            if (!createHarvestEntry) {
                return ResponseHandler.notFound(res, 'Harvest entry not found or user unauthorized');
            }

            ResponseHandler.success(res, 'Harvest entry created successfully', createHarvestEntry);

        } catch (error) {
            console.error('Error creating harvest entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while creating the harvest entry');
        }
    }

    async updateHarvest(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { harvestId } = req.params;
            if (!harvestId) {
                return ResponseHandler.badRequest(res, 'Harvest ID is required');
            }

            try {
                // Check if Image file exists in the request
                let imageFile = null;
                if (req.files && req.files.Image) {
                    imageFile = req.files.Image;
                }

                // Call HarvestService to update the harvest entry
                const harvestData = {
                    ...req.body, // Include all fields from the request body
                    Image: imageFile,
                };

                const updatedHarvestEntry = await HarvestService.updateHarvest(harvestId, harvestData);
                if (!updatedHarvestEntry) {
                    return ResponseHandler.notFound(res, 'Harvest entry not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Harvest entry updated successfully', updatedHarvestEntry);
            } catch (error) {
                console.error('Error updating harvest entry:', error);
                ResponseHandler.serverError(res, 'An error occurred while updating the harvest entry');
            }

        } catch (error) {
            console.error('Error updating harvest entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while updating the harvest entry');
        }
    }

    async toggleHarvestStatus(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { harvestId } = req.params;
            if (!harvestId) {
                return ResponseHandler.badRequest(res, 'Harvest ID is required');
            }

            try {
                const updatedHarvestEntry = await HarvestService.toggleHarvestStatus(harvestId);
                if (!updatedHarvestEntry) {
                    return ResponseHandler.notFound(res, 'Harvest entry not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Harvest status toggled successfully', updatedHarvestEntry);
            } catch (error) {
                console.error('Error toggling harvest status:', error);
                ResponseHandler.serverError(res, 'An error occurred while toggling the harvest status');
            }

        } catch (error) {
            console.error('Error toggling harvest status:', error);
            ResponseHandler.serverError(res, 'An error occurred while toggling the harvest status');
        }
    }

    async getHarvestByProduct(req, res) {
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
                const harvestEntries = await HarvestService.getHarvestByProduct(productCode);
                if (!harvestEntries || harvestEntries.length === 0) {
                    return ResponseHandler.notFound(res, 'No harvest entries found for this product code');
                }

                ResponseHandler.success(res, 'Harvest entries fetched successfully', harvestEntries);
            } catch (error) {
                console.error('Error fetching harvest entries:', error);
                ResponseHandler.serverError(res, 'An error occurred while fetching harvest entries');
            }

        } catch (error) {
            console.error('Error fetching harvest entries:', error);
            ResponseHandler.serverError(res, 'An error occurred while fetching harvest entries');
        }
    }
}

module.exports = new HarvestController();
