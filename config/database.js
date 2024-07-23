const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('project', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Loại cơ sở dữ liệu bạn đang sử dụng
  define: {
    timestamps: false // Tắt chế độ tự động thêm timestamps ở mức toàn cục
  }
});


module.exports = sequelize;
