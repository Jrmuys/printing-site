const User = require("../models/user.model");
const bcrypt = require("bcrypt");

async function insert(user) {
  // make mongoose call to save user in db
  user.hashedPassword = bcrypt.hashSync(user.password, 10);
  delete user.password;

  console.log(`saving user to db`, user);
  return await new User(user).save();
}

function isUserValid(user, password, hashedPassword) {
  return user && bcrypt.compare(password, hashedPassword);
}

async function getUserByEmailIdAndPassword(email, password) {
  let user = await User.findOne({ email });

  if (isUserValid(user, password, user.hashedPassword)) {
    user = user.toObject();
    delete user.hashedPassword;
    return user;
  } else {
    return null;
  }
}

module.exports = {
  insert,
  getUserByEmailIdAndPassword,
};
