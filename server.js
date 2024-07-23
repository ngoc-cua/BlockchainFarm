const http = require('http');
const app = require('./app');
const sequelize = require('./config/database');

sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

// Sync DB
sequelize.sync()
  .then(() => console.log('Database synced...'))
  .catch(err => console.log('Error: ' + err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
