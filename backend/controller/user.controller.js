const User = require("../models/user.model");
const bcrypt = require("bcrypt");

async function insert(user) {
  // make mongoose call to save user in db
  user.hashedPassword = bcrypt.hashSync(user.password, 10);
  delete user.password;

  console.log(`saving user to db`, user);
  return await new User(user).save();
}

module.exports = {
  insert,
};
