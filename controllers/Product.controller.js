const ProductService = require('../services/Product.services');
const ResponseHandler = require('../utils/ErrorHandler');
const { createProductSchema } = require('../validation/Product.validation');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

class ProductController {
    async createProduct(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            // Validate request body against schema
            const { error, value } = createProductSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                return ResponseHandler.badRequest(res, error.details[0].message);
            }

            const { areaId } = req.params;
            if (!areaId) {
                return ResponseHandler.badRequest(res, 'Area ID is required');
            }

            // Check if Image file exists in the request
            if (!req.files || !req.files.Image) {
                return ResponseHandler.badRequest(res, 'Image file is required');
            }

            try {
                
                // Check if Certify file exists in the request
                let certifyFile = null;
                if (req.files.Certify) {
                    certifyFile = req.files.Certify;
                }

                // Call ProductService to create the product
                const productData = {
                    ...value,
                    Image: req.files.Image,
                    Certify: certifyFile,
                    Product_date: new Date() // Assuming Product_date is set to current date
                };

                const product = await ProductService.createProduct(productData, areaId);
                ResponseHandler.success(res, 'Product created successfully', product);
            } catch (error) {
                console.error('Error uploading image or creating product:', error);
                ResponseHandler.serverError(res, 'An error occurred while creating the product');
            }

        } catch (error) {
            console.error('Error creating product:', error);
            ResponseHandler.serverError(res, 'An error occurred while creating the product');
        }
    }
    async updateProduct(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { productId } = req.params;
            if (!productId) {
                return ResponseHandler.badRequest(res, 'Product ID is required');
            }

            try {
                // Check if Image file exists in the request
                let imageFile = null;
                if (req.files && req.files.Image) {
                    imageFile = req.files.Image;
                }

                // Check if Certify file exists in the request
                let certifyFile = null;
                if (req.files && req.files.certify) {
                    certifyFile = req.files.certify;
                }

                // Call ProductService to update the product
                const productData = {
                    ...req.body, // Include all fields from the request body
                    Image: imageFile,
                    Certify: certifyFile
                };

                const updatedProduct = await ProductService.updateProduct(productId, productData);
                if (!updatedProduct) {
                    return ResponseHandler.notFound(res, 'Product not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Product updated successfully', updatedProduct);
            } catch (error) {
                console.error('Error updating product:', error);
                ResponseHandler.serverError(res, 'An error occurred while updating the product');
            }

        } catch (error) {
            console.error('Error updating product:', error);
            ResponseHandler.serverError(res, 'An error occurred while updating the product');
        }
    }
    async toggleProductStatus(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { productId } = req.params;
            if (!productId) {
                return ResponseHandler.badRequest(res, 'Product ID is required');
            }

            try {
                const updatedProduct = await ProductService.toggleProductStatus(productId);
                if (!updatedProduct) {
                    return ResponseHandler.notFound(res, 'Product not found or user unauthorized');
                }

                ResponseHandler.success(res, 'Product status toggled successfully', updatedProduct);
            } catch (error) {
                console.error('Error toggling product status:', error);
                ResponseHandler.serverError(res, 'An error occurred while toggling the product status');
            }

        } catch (error) {
            console.error('Error toggling product status:', error);
            ResponseHandler.serverError(res, 'An error occurred while toggling the product status');
        }
    }
    async getProductsByArea(req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return ResponseHandler.unauthorized(res, 'Authorization token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIdFromHeader = decoded.userId;

            const { areaId } = req.params;
            if (!areaId) {
                return ResponseHandler.badRequest(res, 'Area ID is required');
            }

            try {
                const products = await ProductService.getProductsByArea(areaId);
                if (!products || products.length === 0) {
                    return ResponseHandler.notFound(res, 'No products found for this area');
                }

                ResponseHandler.success(res, 'Products fetched successfully', products);
            } catch (error) {
                console.error('Error fetching products:', error);
                ResponseHandler.serverError(res, 'An error occurred while fetching products');
            }

        } catch (error) {
            console.error('Error fetching products:', error);
            ResponseHandler.serverError(res, 'An error occurred while fetching products');
        }
    }
}

module.exports = new ProductController();
