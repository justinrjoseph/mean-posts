const express = require('express'),
      router = express.Router(),
      User = require('../models/user'),
      bcrypt = require('bcrypt');

const invalidMsg = 'Invalid email or password.';

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email })

  if ( !user ) return res.status(400).send(invalidMsg);

  const passwordInvalid = !(await bcrypt.compare(password, user.password));

  if ( passwordInvalid ) return res.status(400).send(invalidMsg);

  const token = user.generateJwt();

  res.send({ token });
});

module.exports = router;