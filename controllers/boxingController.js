const BoxingService = require('../services/BoxingServices');
const ResponseHandler = require('../utils/ErrorHandler');
const { createBoxingSchema,updateBoxingSchema } = require('../validation/Boxing.validation');
const jwt = require('jsonwebtoken');

class BoxingController {
    async createBoxing(req, res) {
        try {
            // Get token from header
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            // Decode token to get userId
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            // Validate body data
            const { error, value } = createBoxingSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            // Check image file
            const imageFile = req.files && req.files.Image;

            // Call BoxingService to create boxing
            const boxingData = {
                ...value,
                Image: imageFile
            };

            const newBoxing = await BoxingService.createBoxing(boxingData);
            if (!newBoxing) {
                return ResponseHandler.notFound(res, 'Boxing not found or user unauthorized');
            }

            ResponseHandler.success(res, 'Boxing created successfully', newBoxing);
        } catch (error) {
            console.error('Error creating boxing:', error);
            ResponseHandler.serverError(res, 'An error occurred while creating the boxing');
        }
    }

    async updateBoxing(req, res) {
        try {
            // Get token from header
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            // Decode token to get userId
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            // Validate body data
            const { error, value } = updateBoxingSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            const { id } = req.params;
            if (!id) {
                return ResponseHandler.badRequest(res, 'Boxing ID is required');
            }

            // Check image file
            const imageFile = req.files && req.files.Image;

            // Call BoxingService to update boxing
            const boxingData = {
                ...value,
                Image: imageFile
            };

            const updatedBoxing = await BoxingService.updateBoxing(id, boxingData);
            if (!updatedBoxing) {
                return ResponseHandler.notFound(res, 'Boxing not found or user unauthorized');
            }

            ResponseHandler.success(res, 'Boxing updated successfully', updatedBoxing);
        } catch (error) {
            console.error('Error updating boxing:', error);
            ResponseHandler.serverError(res, 'An error occurred while updating the boxing');
        }
    }

    async deleteBoxing(req, res) {
        try {
            // Get token from header
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            // Decode token to get userId
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { id } = req.params;
            if (!id) {
                return ResponseHandler.badRequest(res, 'Boxing ID is required');
            }

            const deletedBoxing = await BoxingService.deleteBoxing(id);
            if (!deletedBoxing) {
                return ResponseHandler.notFound(res, 'Boxing not found or user unauthorized');
            }

            ResponseHandler.success(res, 'Boxing deleted successfully');
        } catch (error) {
            console.error('Error deleting boxing:', error);
            ResponseHandler.serverError(res, 'An error occurred while deleting the boxing');
        }
    }

async getAllBoxings(req, res) {
    try {
        // Get token from header
        const token = req.headers.authorization;
        if (!token) {
            return ResponseHandler.unauthorized(res, 'Authorization token is missing');
        }

        // Decode token to get userId
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return ResponseHandler.unauthorized(res, 'Invalid authorization token');
        }

        const userIdFromHeader = decoded.userId;

        // Ensure that getAllBoxings is awaited
        const boxings =  BoxingService.getAllBoxings();
        if (!boxings || boxings.length === 0) {
            return ResponseHandler.notFound(res, 'No boxings found');
        }

        ResponseHandler.success(res, 'Boxings fetched successfully', boxings);
    } catch (error) {
        console.error('Error fetching boxings:', error);
        ResponseHandler.serverError(res, 'An error occurred while fetching boxings');
    }
}



//     async getBoxingById(req, res) {
//         try {
//             // Get token from header
//             const token = req.headers.authorization;
//             if (!token) {
//                 return ResponseHandler.unauthorized(res, 'Authorization token is missing');
//             }

//             // Decode token to get userId
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             const userIdFromHeader = decoded.userId;

//             const { id } = req.params;
//             if (!id) {
//                 return ResponseHandler.badRequest(res, 'Boxing ID is required');
//             }

//             const boxing = await BoxingService.getBoxingById(id);
//             if (!boxing) {
//                 return ResponseHandler.notFound
// (res, 'Boxing not found or user unauthorized');
// }
//         ResponseHandler.success(res, 'Boxing fetched successfully', boxing);
//     } catch (error) {
//         console.error('Error fetching boxing:', error);
//         ResponseHandler.serverError(res, 'An error occurred while fetching the boxing');
//     }
// }
}

module.exports = new BoxingController();