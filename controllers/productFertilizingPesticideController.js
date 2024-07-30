const ProductFertilizingPesticideService = require('../services/productFertilizingPesticideService');

class ProductFertilizingPesticideController {
  static async create(req, res) {
    try {
      const data = req.body;
      const result = await ProductFertilizingPesticideService.create(data);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async findAll(req, res) {
    try {
      const result = await ProductFertilizingPesticideService.findAll();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async findById(req, res) {
    try {
      const id = req.params.id;
      const result = await ProductFertilizingPesticideService.findById(id);
      if (result) {
        return res.status(200).json(result);
      }
      return res.status(404).json({ error: 'Record not found' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      const result = await ProductFertilizingPesticideService.update(id, data);
      if (result) {
        return res.status(200).json(result);
      }
      return res.status(404).json({ error: 'Record not found' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const id = req.params.id;
      const result = await ProductFertilizingPesticideService.delete(id);
      if (result) {
        return res.status(204).json();
      }
      return res.status(404).json({ error: 'Record not found' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProductFertilizingPesticideController;
