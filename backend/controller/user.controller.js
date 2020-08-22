const User = require("../models/user.model");
const bcrypt = require("bcrypt");

async function insert(user) {
  // make mongoose call to save user in db
  user.hashedPassword = bcrypt.hashSync(user.password, 10);
  delete user.password;

  console.log(`saving user to db`, user);
  return await new User(user).save();
}

async function isUserValid(user, password, hashedPassword) {
  return user && (await bcrypt.compare(password, hashedPassword));
}

async function getUserByEmailIdAndPassword(email, password) {
  let user = await User.findOne({ email });
  if (user) {
    if (await isUserValid(user, password, user.hashedPassword)) {
      user = user.toObject();
      delete user.hashedPassword;
      return user;
    } else {
      return null;
    }
  } else return null;
}

async function getUserById(id) {
  let user = await User.findById(id);
  console.log("findById(): User = ", user);
  if (user) {
    user = user.toObject();
    delete user.hashedPassword;
    return user;
  } else {
    return null;
  }
}

async function getUserByEmail(email) {
  let user = await User.findOne({ email });
  if (user) {
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
  getUserById,
  getUserByEmail,
};
