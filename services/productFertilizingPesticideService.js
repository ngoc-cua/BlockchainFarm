const ProductFertilizingPesticide = require('../models/ProductFertilizingPesticide');

class ProductFertilizingPesticideService {
  static async create(data) {
    return await ProductFertilizingPesticide.create(data);
  }

  static async findAll() {
    return await ProductFertilizingPesticide.findAll();
  }

  static async findById(id) {
    return await ProductFertilizingPesticide.findByPk(id);
  }

  static async update(id, data) {
    const record = await this.findById(id);
    if (record) {
      return await record.update(data);
    }
    return null;
  }

  static async delete(id) {
    const record = await this.findById(id);
    if (record) {
      return await record.destroy();
    }
    return null;
  }
}

module.exports = ProductFertilizingPesticideService;
