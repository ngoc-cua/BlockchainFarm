const PruningService = require('../services/PruningServices');
const ResponseHandler = require('../utils/ErrorHandler');
const { createPruningSchema } = require('../validation/Pruning.validation');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class PruningController {
    async createPruning(req, res) {
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
            const { error, value } = createPruningSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            // Kiểm tra tệp tin ảnh
            const imageFile = req.files && req.files.Image;

            // Gọi PruningService để tạo thông tin tỉa
            const pruningData = {
                ...value,
                Image: imageFile
            };

            const createPruningEntry = await PruningService.createPruning(pruningData);
            if (!createPruningEntry) {
                return ResponseHandler.notFound(res, 'Pruning entry not found or user unauthorized');
            }

            ResponseHandler.success(res, 'Pruning entry created successfully', createPruningEntry);

        } catch (error) {
            console.error('Error creating pruning entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while creating the pruning entry');
        }
    }

    async updatePruning(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { pruningId } = req.params;
            if (!pruningId) {
                return ResponseHandler.badRequest(res, 'Pruning ID is required');
            }

            try {
                // Check if Image file exists in the request
                let imageFile = null;
                if (req.files && req.files.Image) {
                    imageFile = req.files.Image;
                }

                // Call PruningService to update the pruning entry
                const pruningData = {
                    ...req.body, // Include all fields from the request body
                    Image: imageFile,
                };

                const updatedPruningEntry = await PruningService.updatePruning(pruningId, pruningData);
                if (!updatedPruningEntry) {
                    return ResponseHandler.notFound(res, 'Pruning entry not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Pruning entry updated successfully', updatedPruningEntry);
            } catch (error) {
                console.error('Error updating pruning entry:', error);
                ResponseHandler.serverError(res, 'An error occurred while updating the pruning entry');
            }

        } catch (error) {
            console.error('Error updating pruning entry:', error);
            ResponseHandler.serverError(res, 'An error occurred while updating the pruning entry');
        }
    }

    async togglePruningStatus(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { pruningId } = req.params;
            if (!pruningId) {
                return ResponseHandler.badRequest(res, 'Pruning ID is required');
            }

            try {
                const updatedPruningEntry = await PruningService.togglePruningStatus(pruningId);
                if (!updatedPruningEntry) {
                    return ResponseHandler.notFound(res, 'Pruning entry not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Pruning status toggled successfully', updatedPruningEntry);
            } catch (error) {
                console.error('Error toggling pruning status:', error);
                ResponseHandler.serverError(res, 'An error occurred while toggling the pruning status');
            }

        } catch (error) {
            console.error('Error toggling pruning status:', error);
            ResponseHandler.serverError(res, 'An error occurred while toggling the pruning status');
        }
    }

    async getPruningByProduct(req, res) {
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
                const pruningEntries = await PruningService.getPruningByProduct(productCode);
                if (!pruningEntries || pruningEntries.length === 0) {
                    return ResponseHandler.notFound(res, 'No pruning entries found for this product code');
                }

                ResponseHandler.success(res, 'Pruning entries fetched successfully', pruningEntries);
            } catch (error) {
                console.error('Error fetching pruning entries:', error);
                ResponseHandler.serverError(res, 'An error occurred while fetching pruning entries');
            }

        } catch (error) {
            console.error('Error fetching pruning entries:', error);
            ResponseHandler.serverError(res, 'An error occurred while fetching pruning entries');
        }
    }
}

module.exports = new PruningController();
