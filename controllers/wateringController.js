const WateringService = require('../services/WateringService');
const ResponseHandler = require('../utils/ErrorHandler');
const { createWateringSchema } = require('../validation/Watering.validation');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class WateringController {
async createWatering(req, res) {
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
        const { error, value } = createWateringSchema.validate(req.body, { stripUnknown: true });
        if (error) {
            return ResponseHandler.badRequest(res, error.details[0].message);
        }

        // Kiểm tra tệp tin ảnh
        const imageFile = req.files && req.files.Image;

        // Gọi WateringService để tạo thông tin tưới
        const wateringData = {
            ...value,
            Image: imageFile
        };

       const createWateringEntry = await WateringService.createWatering( wateringData);
                if (!createWateringEntry) {
                    return ResponseHandler.notFound(res, 'Watering entry not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Watering entry create successfully',createWateringEntry);

    } catch (error) {
        console.error('Error creating watering entry:', error);
        ResponseHandler.serverError(res, 'An error occurred while creating the watering entry');
    }
}

    async updateWatering(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { wateringId } = req.params;
            if (!wateringId) {
                return ResponseHandler.badRequest(res, 'Watering ID is required');
            }

            try {
                // Check if Image file exists in the request
                let imageFile = null;
                if (req.files && req.files.Image) {
                    imageFile = req.files.Image;
                }

                // Call WateringService to update the watering entry
                const wateringData = {
                    ...req.body, // Include all fields from the request body
                    Image: imageFile,
                };

                const updatedWateringEntry = await WateringService.updateWatering(wateringId, wateringData);
                if (!updatedWateringEntry) {
                    return ResponseHandler.notFound(res, 'Watering entry not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Watering entry updated successfully', updatedWateringEntry);
            } catch (error) {
                console.error('Error updating watering entry:', error);
                ResponseHandler.serverError(res, 'An error occurred while updating the watering entry');
            }

        } catch (error) {
            console.error('Error updating watering entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while updating the watering entry');
        }
    }

    async toggleWateringStatus(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { wateringId } = req.params;
            if (!wateringId) {
                return ResponseHandler.badRequest(res, 'Watering ID is required');
            }

            try {
                const updatedWateringEntry = await WateringService.toggleWateringStatus(wateringId);
                if (!updatedWateringEntry) {
                    return ResponseHandler.notFound(res, 'Watering entry not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Watering status toggled successfully', updatedWateringEntry);
            } catch (error) {
                console.error('Error toggling watering status:', error);
                ResponseHandler.serverError(res, 'An error occurred while toggling the watering status');
            }

        } catch (error) {
            console.error('Error toggling watering status:', error);
            ResponseHandler.serverError(res, 'An error occurred while toggling the watering status');
        }
    }

    async getWateringByProduct(req, res) {
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
                const wateringEntries = await WateringService.getWateringByProduct(productCode);
                if (!wateringEntries || wateringEntries.length === 0) {
                    return ResponseHandler.notFound(res, 'No watering entries found for this product code');
                }

                ResponseHandler.success(res, 'Watering entries fetched successfully', wateringEntries);
            } catch (error) {
                console.error('Error fetching watering entries:', error);
                ResponseHandler.serverError(res, 'An error occurred while fetching watering entries');
            }

        } catch (error) {
            console.error('Error fetching watering entries:', error);
            ResponseHandler.serverError(res, 'An error occurred while fetching watering entries');
        }
    }
}

module.exports = new WateringController();
