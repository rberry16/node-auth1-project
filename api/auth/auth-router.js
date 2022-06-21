// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const router = require('express').Router();
const md = require('./auth-middleware');
const User = require('../users/users-model');
const bcrypt = require('bcryptjs');

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */
  router.post('/register', md.checkUsernameFree, md.checkPasswordLength, async (req, res, next) => {
    try {
      const {username, password} = req.body;
      const hash = bcrypt.hashSync(password, 8);
      const newUser = await User.add({username, password: hash});
      res.status(200).json(newUser);
    } catch (err) {
      next(err);
    }
  })

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */
router.post('/login', md.checkUsernameExists, async (req, res, next) => {
  try {
    const {password} = req.body;
    if (bcrypt.compareSync(password, req.user.password)) {
      req.session.user = req.user;
      res.json({message: `welcome ${req.body.username}!`});
    } else {
      res.status(401).json({message: 'Invalid credentials'});
    }
  } catch (err) {
    next(err);
  }
})

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */
router.get('/logout', (req, res, next) => {
  try {
    if (req.session.user) {
      req.session.user = null;
      res.json({message: 'logged out'});
    } else {
      res.json({message: 'no session'});
    }
  } catch (err) {
    next(err);
  }
})

 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;