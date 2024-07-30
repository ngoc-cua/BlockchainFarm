const productFertilizingPesticideService = require('../services/productFertilizingPesticideService');

class ProductFertilizingPesticideController {
  async create(req, res) {
    try {
      const entry = await productFertilizingPesticideService.createEntry(req.body);
      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const entries = await productFertilizingPesticideService.getAllEntries();
      res.status(200).json(entries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const entry = await productFertilizingPesticideService.getEntryById(req.params.id);
      if (entry) {
        res.status(200).json(entry);
      } else {
        res.status(404).json({ error: 'Entry not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const entry = await productFertilizingPesticideService.updateEntry(req.params.id, req.body);
      if (entry) {
        res.status(200).json(entry);
      } else {
        res.status(404).json({ error: 'Entry not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const success = await productFertilizingPesticideService.deleteEntry(req.params.id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Entry not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProductFertilizingPesticideController();
