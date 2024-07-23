const PesticideService = require('../services/PesticideServices');
const ResponseHandler = require('../utils/ErrorHandler');
const { createPesticideSchema } = require('../validation/Pesticide.validation');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class PesticideController {
    async createPesticide(req, res) {
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
            const { error, value } = createPesticideSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            // Kiểm tra tệp tin ảnh
            const imageFile = req.files && req.files.Image;

            // Gọi PesticideService để tạo thông tin tưới
            const pesticideData = {
                ...value,
                Image: imageFile
            };

            const createPesticideEntry = await PesticideService.createPesticide(pesticideData);
            if (!createPesticideEntry) {
                return ResponseHandler.notFound(res, 'Pesticide entry not found or user unauthorized');
            }

            ResponseHandler.success(res, 'Pesticide entry create successfully', createPesticideEntry);

        } catch (error) {
            console.error('Error creating pesticide entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while creating the pesticide entry');
        }
    }

    async updatePesticide(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { pesticideId } = req.params;
            if (!pesticideId) {
                return ResponseHandler.badRequest(res, 'Pesticide ID is required');
            }

            try {
                // Check if Image file exists in the request
                let imageFile = null;
                if (req.files && req.files.Image) {
                    imageFile = req.files.Image;
                }

                // Call PesticideService to update the pesticide entry
                const pesticideData = {
                    ...req.body, // Include all fields from the request body
                    Image: imageFile,
                };

                const updatedPesticideEntry = await PesticideService.updatePesticide(pesticideId, pesticideData);
                if (!updatedPesticideEntry) {
                    return ResponseHandler.notFound(res, 'Pesticide entry not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Pesticide entry updated successfully', updatedPesticideEntry);
            } catch (error) {
                console.error('Error updating pesticide entry:', error);
                ResponseHandler.serverError(res, 'An error occurred while updating the pesticide entry');
            }

        } catch (error) {
            console.error('Error updating pesticide entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while updating the pesticide entry');
        }
    }

    async togglePesticideStatus(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { pesticideId } = req.params;
            if (!pesticideId) {
                return ResponseHandler.badRequest(res, 'Pesticide ID is required');
            }

            try {
                const updatedPesticideEntry = await PesticideService.togglePesticideStatus(pesticideId);
                if (!updatedPesticideEntry) {
                    return ResponseHandler.notFound(res, 'Pesticide entry not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Pesticide status toggled successfully', updatedPesticideEntry);
            } catch (error) {
                console.error('Error toggling pesticide status:', error);
                ResponseHandler.serverError(res, 'An error occurred while toggling the pesticide status');
            }

        } catch (error) {
            console.error('Error toggling pesticide status:', error);
            ResponseHandler.serverError(res, 'An error occurred while toggling the pesticide status');
        }
    }

    async getPesticideByProduct(req, res) {
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
                const pesticideEntries = await PesticideService.getPesticideByProduct(productCode);
                if (!pesticideEntries || pesticideEntries.length === 0) {
                    return ResponseHandler.notFound(res, 'No pesticide entries found for this product code');
                }

                ResponseHandler.success(res, 'Pesticide entries fetched successfully', pesticideEntries);
            } catch (error) {
                console.error('Error fetching pesticide entries:', error);
                ResponseHandler.serverError(res, 'An error occurred while fetching pesticide entries');
            }

        } catch (error) {
            console.error('Error fetching pesticide entries:', error);
            ResponseHandler.serverError(res, 'An error occurred while fetching pesticide entries');
        }
    }
}

module.exports = new PesticideController();
