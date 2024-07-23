const CompanyInfo = require("../models/company_info.model");
const District = require("../models/districts.model");
const Province = require("../models/provinces.model");
const Ward = require("../models/wards.model");

class CompanyService {
  async updateCompany(companyId, companyData) {
    const {
      company_name,
      district_code,
      wards_code,
      provinces_code,
      description,
      Address // Add the address field
    } = companyData;

    try {
      // Retrieve existing company information
      let company = await CompanyInfo.findByPk(companyId);
      if (!company) {
        throw new Error("Company not found");
      }

      // Update company information if provided
      if (company_name) {
        company.company_name = company_name;
      }

      if (district_code) {
        // Check if the provided district code exists and belongs to the specified province
        const district = await District.findOne({
          where: { code: district_code, province_code: provinces_code },
        });
        if (!district) {
          throw new Error("Invalid district code for the specified province");
        }
        company.district_code = district_code;
      }

      if (wards_code) {
        // Check if the provided ward code belongs to the specified district and province
        const ward = await Ward.findOne({
          where: { code: wards_code, district_code },
        });
        if (!ward) {
          throw new Error("Invalid ward code for the district");
        }
        company.wards_code = wards_code;
      }

      if (provinces_code) {
        // Check if the provided province code exists
        const province = await Province.findOne({
          where: { code: provinces_code },
        });
        if (!province) {
          throw new Error("Invalid province code");
        }
        company.provinces_code = provinces_code;
      }

      if (description) {
        company.description = description;
      }

      if (Address) { // Add address field update
        company.Address = Address;
      }

      // Save the updated company information
      await company.save();

      return company;
    } catch (error) {
      console.error("Company update error:", error.message);
      throw error;
    }
  }
}

module.exports = new CompanyService();
