const ShipmentService = require('../services/ShipmentServices');
const ResponseHandler = require('../utils/ErrorHandler');
const { createShipmentSchema, updateShipmentSchema } = require('../validation/Shipment.validation');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class ShipmentController {
    async createShipment(req, res) {
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
            const { error, value } = createShipmentSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }
            if (!req.files || !req.files.Image) {
                return ResponseHandler.badRequest(res, 'Image file is required');
            }

            try {
                const shipmentData = {
                    ...value,
                    Image: req.files.Image,
                    shipment_date: new Date()
                };

                const createdShipment =  ShipmentService.createShipment(shipmentData);
                ResponseHandler.success(res, 'Shipment created successfully', createdShipment);
            }catch (error) {
                console.error('Error uploading image or creating shipment:', error);
                ResponseHandler.serverError(res, 'An error occurred while creating the shipment');
            }
  
       } catch (error) {
            console.error('Error creating shipment:', error);
            ResponseHandler.serverError(res, 'An error occurred while creating the shipment');
        }
    }

    async updateShipment(req, res) {
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
            const { error, value } = updateShipmentSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            const { shipmentId } = req.params;
            if (!shipmentId) {
                return ResponseHandler.badRequest(res, 'Shipment ID is required');
            }

            // Kiểm tra tệp tin ảnh
            const imageFile = req.file;

            // Gọi ShipmentService để cập nhật lô hàng
            let imageResult = null;
            if (imageFile) {
                imageResult = await cloudinary.uploader.upload(imageFile.path);
            }

            const shipmentData = {
                ...value,
                Image: imageFile ? JSON.stringify({ id: imageResult.public_id, url: imageResult.secure_url }) : null
            };

            const updatedShipment = await ShipmentService.updateShipment(shipmentId, shipmentData);
            if (!updatedShipment) {
                return ResponseHandler.notFound(res, 'Shipment not found or user unauthorized');
            }

            ResponseHandler.success(res, 'Shipment updated successfully', updatedShipment);
        } catch (error) {
            console.error('Error updating shipment:', error);
            ResponseHandler.serverError(res, 'An error occurred while updating the shipment');
        }
    }

    async deleteShipment(req, res) {
        try {
            // Lấy token từ header
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            // Giải mã token để lấy userId
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { shipmentId } = req.params;
            if (!shipmentId) {
                return ResponseHandler.badRequest(res, 'Shipment ID is required');
            }

            const deletedShipment = await ShipmentService.deleteShipment(shipmentId);
            if (!deletedShipment) {
                return ResponseHandler.notFound(res, 'Shipment not found or user unauthorized');
            }

            ResponseHandler.success(res, 'Shipment deleted successfully');
        } catch (error) {
            console.error('Error deleting shipment:', error);
            ResponseHandler.serverError(res, 'An error occurred while deleting the shipment');
        }
    }

    async getAllShipments(req, res) {
        try {
            // Lấy token từ header
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            // Giải mã token để lấy userId
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const shipments = await ShipmentService.getAllShipments();
            if (!shipments || shipments.length === 0) {
                return ResponseHandler.notFound(res, 'No shipments found');
            }

            ResponseHandler.success(res, 'Shipments fetched successfully', shipments);
        } catch (error) {
            console.error('Error fetching shipments:', error);
            ResponseHandler.serverError(res, 'An error occurred while fetching shipments');
        }
    }

    async getShipmentById(req, res) {
        try {
            // Lấy token từ header
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            // Giải mã token để lấy userId
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { shipmentId } = req.params;
            if (!shipmentId) {
                return ResponseHandler.badRequest(res, 'Shipment ID is required');
            }

            const shipment = await ShipmentService.getShipmentById(shipmentId);
            if (!shipment) {
                return ResponseHandler.notFound(res, 'Shipment not found');
            }

            ResponseHandler.success(res, 'Shipment fetched successfully', shipment);
        } catch (error) {
            console.error('Error fetching shipment:', error);
            ResponseHandler.serverError(res, 'An error occurred while fetching the shipment');
        }
    }
}

module.exports = new ShipmentController();
