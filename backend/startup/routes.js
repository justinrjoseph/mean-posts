const express = require('express'),
      users = require('../routes/users'),
      auth = require('../routes/auth'),
      posts = require('../routes/posts');

module.exports = (app) => {
  app.use(express.json());
  app.use('/images', express.static('images'));
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/posts', posts);
};