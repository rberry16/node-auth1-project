// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const router = require('express').Router();
const User = require('./users-model');
const md = require('../auth/auth-middleware');
/**
  [GET] /api/users

  This endpoint is RESTRICTED: only authenticated clients
  should have access.

  response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response on non-authenticated:
  status 401
  {
    "message": "You shall not pass!"
  }
 */

  router.get('/', md.restricted, async (req, res, next) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  });

  router.post('/', md.checkUsernameFree, md.checkPasswordLength, async (req, res, next) => {
    try {
      const newUser = await User.add(req.body);
      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  });



// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;