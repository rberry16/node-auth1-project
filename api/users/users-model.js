const db = require('../../data/db-config');

/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
async function find() {
  const usersArray = await db('users');
  const users = [];

  await usersArray.forEach(user => {
    users.push({
      user_id: user.user_id,
      username: user.username
    });
  });

  return users;
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
async function findBy(filter) {
  const user = await db('users').where(filter).first();
  if (!user || user === undefined) {
    return null;
  } else {
    return {
      user_id: user.user_id,
      username: user.username
    };
  }
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
async function findById(user_id) {
const user = await db('users').where('user_id', user_id).first();
if (!user || user === undefined) {
  return null;
} else {
  return {
    user_id: user.user_id,
    username: user.username
  }; 
}
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
  await db('users').insert(user);
  const newUser = await findBy({username: user.username});
  return newUser;
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  find,
  findBy,
  findById,
  add,
}