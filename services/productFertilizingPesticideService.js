const { ProductFertilizingPesticide } = require('../models/ProductFertilizingPesticide');

class ProductFertilizingPesticideService {
  async createEntry(data) {
    return await ProductFertilizingPesticide.create(data);
  }

  async getAllEntries() {
    return await ProductFertilizingPesticide.findAll();
  }

  async getEntryById(id) {
    return await ProductFertilizingPesticide.findByPk(id);
  }

  async updateEntry(id, data) {
    const entry = await ProductFertilizingPesticide.findByPk(id);
    if (entry) {
      return await entry.update(data);
    }
    return null;
  }

  async deleteEntry(id) {
    const entry = await ProductFertilizingPesticide.findByPk(id);
    if (entry) {
      await entry.destroy();
      return true;
    }
    return false;
  }
}

module.exports = new ProductFertilizingPesticideService();
