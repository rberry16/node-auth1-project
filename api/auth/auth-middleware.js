const User = require('../users/users-model');
const db = require('../../data/db-config');

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({message: 'You shall not pass!'});
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  try {
    const free = await User.findBy({username: req.body.username});
    if (!free) {
      next();
    } else {
      res.status(422).json({message: 'username taken'});
    }
  } catch (err) {
    next(err);
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  try {
    const existing = await User.findBy({username: req.body.username});
    if (!existing) {
      res.status(401).json({message: 'Invalid credentials'});
    } else {
      const user = await db('users').where({username: req.body.username}).first();
      req.user = user;
      next();
    }
  } catch (err) {
    next(err);
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  try {
    if (!req.body.password || req.body.password === undefined || req.body.password.trim().length <= 3) {
      res.status(422).json({message: 'Password must be longer than 3 chars'});
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}
