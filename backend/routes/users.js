const express = require('express'),
      router = express.Router(),
      User = require('../models/user'),
      bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if ( user ) return res.status(400).send('Invalid email or password.');

  user = new User({ email });

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(password, salt);

  await user.save();

  const token = user.generateJwt();

  res.send({ token });
});

module.exports = router;