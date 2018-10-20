const jwt = require('jsonwebtoken'),
      config = require('config');

const deniedMsg = 'Access denied';

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if ( !authHeader ) return res.status(401).send(deniedMsg);

  const token = authHeader.split(' ')[1];

  if ( !token ) return res.status(401).send(deniedMsg);

  try {
    const user = jwt.verify(token, config.get('jwtPrivateKey'));

    req.user = user;

    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};