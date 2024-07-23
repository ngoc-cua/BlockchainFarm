const FruitBaggingService = require('../services/Fruit_baggingServices');
const ResponseHandler = require('../utils/ErrorHandler');
const { createFruitBaggingSchema } = require('../validation/Fruit_bagging.validation');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class FruitBaggingController {
    async createFruitBagging(req, res) {
        try {
            // Lấy token từ header
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            // Giải mã token để lấy userId
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            // Xác thực dữ liệu từ body
            const { error, value } = createFruitBaggingSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            // Kiểm tra tệp tin ảnh
            const imageFile = req.files && req.files.Image;

            // Gọi FruitBaggingService để tạo thông tin bao trái
            const fruitBaggingData = {
                ...value,
                Image: imageFile
            };

            const createFruitBaggingEntry = await FruitBaggingService.createFruitBagging(fruitBaggingData);
            if (!createFruitBaggingEntry) {
                return ResponseHandler.notFound(res, 'Fruit bagging entry not found or user unauthorized');
            }

            ResponseHandler.success(res, 'Fruit bagging entry created successfully', createFruitBaggingEntry);
        } catch (error) {
            console.error('Error creating fruit bagging entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while creating the fruit bagging entry');
        }
    }

    async updateFruitBagging(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { fruitBaggingId } = req.params;
            if (!fruitBaggingId) {
                return ResponseHandler.badRequest(res, 'Fruit bagging ID is required');
            }

            try {
                // Check if Image file exists in the request
                let imageFile = null;
                if (req.files && req.files.Image) {
                    imageFile = req.files.Image;
                }

                // Call FruitBaggingService to update the fruit bagging entry
                const fruitBaggingData = {
                    ...req.body, // Include all fields from the request body
                    Image: imageFile,
                };

                const updatedFruitBaggingEntry = await FruitBaggingService.updateFruitBagging(fruitBaggingId, fruitBaggingData);
                if (!updatedFruitBaggingEntry) {
                    return ResponseHandler.notFound(res, 'Fruit bagging entry not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Fruit bagging entry updated successfully', updatedFruitBaggingEntry);
            } catch (error) {
                console.error('Error updating fruit bagging entry:', error);
                ResponseHandler.serverError(res, 'An error occurred while updating the fruit bagging entry');
            }

        } catch (error) {
            console.error('Error updating fruit bagging entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while updating the fruit bagging entry');
        }
    }

    async toggleFruitBaggingStatus(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { fruitBaggingId } = req.params;
            if (!fruitBaggingId) {
                return ResponseHandler.badRequest(res, 'Fruit bagging ID is required');
            }

            try {
                const updatedFruitBaggingEntry = await FruitBaggingService.toggleFruitBaggingStatus(fruitBaggingId);
                if (!updatedFruitBaggingEntry) {
                    return ResponseHandler.notFound(res, 'Fruit bagging entry not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Fruit bagging status toggled successfully', updatedFruitBaggingEntry);
            } catch (error) {
                console.error('Error toggling fruit bagging status:', error);
                ResponseHandler.serverError(res, 'An error occurred while toggling the fruit bagging status');
            }

        } catch (error) {
            console.error('Error toggling fruit bagging status:', error);
            ResponseHandler.serverError(res, 'An error occurred while toggling the fruit bagging status');
        }
    }

    async getFruitBaggingByProduct(req, res) {
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
                const fruitBaggingEntries = await FruitBaggingService.getFruitBaggingByProduct(productCode);
                if (!fruitBaggingEntries || fruitBaggingEntries.length === 0) {
                    return ResponseHandler.notFound(res, 'No fruit bagging entries found for this product code');
                }

                ResponseHandler.success(res, 'Fruit bagging entries fetched successfully', fruitBaggingEntries);
            } catch (error) {
                console.error('Error fetching fruit bagging entries:', error);
                ResponseHandler.serverError(res, 'An error occurred while fetching fruit bagging entries');
            }

        } catch (error) {
            console.error('Error fetching fruit bagging entries:', error);
            ResponseHandler.serverError(res, 'An error occurred while fetching fruit bagging entries');
        }
    }
}

module.exports = new FruitBaggingController();
