const productCompanyService = require('../services/productCompanyService');

exports.getAllProductCompanies = async (req, res) => {
    try {
        const productCompanies = await productCompanyService.getAllProductCompanies();
        res.status(200).json(productCompanies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductCompanyById = async (req, res) => {
    try {
        const productCompany = await productCompanyService.getProductCompanyById(req.params.id);
        if (productCompany) {
            res.status(200).json(productCompany);
        } else {
            res.status(404).json({ message: 'ProductCompany not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createProductCompany = async (req, res) => {
    try {
        const productCompany = await productCompanyService.createProductCompany(req.body);
        res.status(201).json(productCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProductCompany = async (req, res) => {
    try {
        const updatedProductCompany = await productCompanyService.updateProductCompany(req.params.id, req.body);
        if (updatedProductCompany) {
            res.status(200).json(updatedProductCompany);
        } else {
            res.status(404).json({ message: 'ProductCompany not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProductCompany = async (req, res) => {
    try {
        const success = await productCompanyService.deleteProductCompany(req.params.id);
        if (success) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'ProductCompany not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
