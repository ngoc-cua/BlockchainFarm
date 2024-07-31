const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Boxing = sequelize.define('Boxing', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Image: {
    type: DataTypes.JSON,
    allowNull: true
  },
  delivery_code: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Shipments',
      key: 'delivery_code'
    }
  },
  confirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  tableName: 'boxing',
  timestamps: false,
});
Boxing.associate = (models) => {
  Boxing.belongsTo(models.Shipment, { foreignKey: 'delivery_code', as: 'Shipment' });
};
module.exports = Boxing;
