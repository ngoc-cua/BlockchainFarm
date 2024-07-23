const AreaService = require('../services/Area.services');
const ResponseHandler = require('../utils/ErrorHandler');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class AreaController {
    async createArea(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const data = req.body;

            if (!req.files || !req.files.Image) {
                return ResponseHandler.badRequest(res, 'Image file is required');
            }

            try {
                const imageResult = await cloudinary.uploader.upload(req.files.Image.tempFilePath);
                data.Image = {
                    id: imageResult.public_id,
                    url: imageResult.secure_url
                };

                const area = await AreaService.createArea(data, userIdFromHeader);
                ResponseHandler.success(res, 'Area created successfully', area);
            } catch (error) {
                console.error('Error uploading image or creating area:', error);
                ResponseHandler.serverError(res, 'An error occurred while creating the area');
            }

        } catch (error) {
            console.error('Error creating area:', error);
            ResponseHandler.serverError(res, 'An error occurred while creating the area');
        }
    }

    async updateArea(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const data = req.body;
            const { areaId } = req.params;

            if (req.files && req.files.Image) {
                try {
                    const imageResult = await cloudinary.uploader.upload(req.files.Image.tempFilePath);
                    data.Image = {
                        id: imageResult.public_id,
                        url: imageResult.secure_url
                    };
                } catch (error) {
                    console.error('Error uploading image:', error);
                    return ResponseHandler.serverError(res, 'An error occurred while uploading the image');
                }
            }

            const area = await AreaService.updateArea(areaId, data, userIdFromHeader);
            ResponseHandler.success(res, 'Area updated successfully', area);

        } catch (error) {
            console.error('Error updating area:', error);
            ResponseHandler.serverError(res, 'An error occurred while updating the area');
        }
    }
    async toggleAreaStatus(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { areaId } = req.params;

            const area = await AreaService.toggleAreaStatus(areaId, userIdFromHeader);
            ResponseHandler.success(res, 'Area status toggled successfully', area);

        } catch (error) {
            console.error('Error toggling area status:', error);
            ResponseHandler.serverError(res, 'An error occurred while toggling the area status');
        }
    }
    async getAllAreas(req, res) {
        try {
            const areas = await AreaService.getAllAreas();
            ResponseHandler.success(res, 'Areas fetched successfully', areas);
        } catch (error) {
            console.error('Error fetching areas:', error);
            ResponseHandler.serverError(res, 'An error occurred while fetching areas');
        }
    }
}

module.exports = new AreaController();
