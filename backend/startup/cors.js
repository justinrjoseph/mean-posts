const cors = require('../middleware/cors');

module.exports = (app) => {
  app.use(cors);
};