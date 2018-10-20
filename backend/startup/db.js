const mongoose = require('mongoose');

module.exports = () => {
  mongoose.connect('mongodb://localhost/mean-posts', { useNewUrlParser: true })
    .then(() => console.log('Connected to Mongo DB database.'))
    .catch(() => console.error('There was a problem connecting to the database.'));
};