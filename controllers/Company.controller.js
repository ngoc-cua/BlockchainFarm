const CompanyService = require('../services/Company.services');
const ResponseHandler = require('../utils/ErrorHandler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class CompanyController {
  async updateCompany(req, res) {
    const token = req.headers.authorization;
    if (!token) return ResponseHandler.badRequest(res, 'Authorization header is required');

    // Decode the JWT token to get the email
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const companyId = decoded.company_id;
    const companyData = req.body;

    try {
        console.log(companyId);
      const company = await CompanyService.updateCompany(companyId, companyData);
      ResponseHandler.success(res, 'Company information updated successfully', company);
    } catch (error) {
      ResponseHandler.serverError(res, error.message);
    }
  }
}

module.exports = new CompanyController();
