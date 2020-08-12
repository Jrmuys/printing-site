users = [];

async function insert(user) {
  // make mongoose call to save user in db
  return users.push(user);
}

module.exports = {
  insert,
};
