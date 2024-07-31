const ProductCompany = require('../models/productcompany');
const Product = require('../models/Products.model');
const CompanyInfo = require('../models/company_info.model');

class ProductCompanyService {
    async getAllProductCompanies() {
        try {
            return await ProductCompany.findAll({
                include: [Product, CompanyInfo],
            });
        } catch (error) {
            throw new Error('Error retrieving data: ' + error.message);
        }
    }

    async getProductCompanyById(id) {
        try {
            return await ProductCompany.findByPk(id, {
                include: [Product, CompanyInfo],
            });
        } catch (error) {
            throw new Error('Error retrieving data: ' + error.message);
        }
    }

    async createProductCompany(data) {
        try {
            return await ProductCompany.create(data);
        } catch (error) {
            throw new Error('Error creating data: ' + error.message);
        }
    }

    async updateProductCompany(id, data) {
        try {
            const [updated] = await ProductCompany.update(data, {
                where: { id },
            });
            if (updated) {
                return await ProductCompany.findByPk(id);
            }
            return null;
        } catch (error) {
            throw new Error('Error updating data: ' + error.message);
        }
    }

    async deleteProductCompany(id) {
        try {
            const deleted = await ProductCompany.destroy({
                where: { id },
            });
            return deleted > 0;
        } catch (error) {
            throw new Error('Error deleting data: ' + error.message);
        }
    }
}

module.exports = new ProductCompanyService();
