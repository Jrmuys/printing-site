const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

async function insert(user) {
  // make mongoose call to save user in db
  user.hashedPassword = bcrypt.hashSync(user.password, 10);
  delete user.password;

  console.log(`saving user to db`, user);
  return await new User(user).save().catch((error) => {
    console.log("FOUND ERROR", error.code);
    if (error.code == 11000) error = new Error("Email already registered");
    throw error;
  });
}

async function isUserValid(user, password, hashedPassword) {
  return (
    user &&
    (await bcrypt.compare(password, hashedPassword).catch((err) => {
      res.status(400).json({ message: "Authorization failed", error: err });
    }))
  );
}

async function getUserByEmailIdAndPassword(email, password) {
  let user = await User.findOne({ email }).catch((err) => {
    res
      .status(500)
      .json({ message: "An error in finding the model occurred", error: err });
  });
  if (user) {
    if (
      await isUserValid(user, password, user.hashedPassword).catch((err) => {
        res.status(500).json({
          message: "An error in validating the user occurred",
          error: err,
        });
      })
    ) {
      user = user.toObject();
      delete user.hashedPassword;
      return user;
    } else {
      return null;
    }
  } else return null;
}

async function getUserById(id) {
  let user = await User.findById(id).catch((err) => {
    res
      .status(500)
      .json({ message: "An error in finding the user occurred", error: err });
  });
  // console.log("findById(): User = ", user);
  if (user) {
    user = user.toObject();
    delete user.hashedPassword;
    return user;
  } else {
    return null;
  }
}

async function getUserByEmail(email) {
  let user = await User.findOne({ email }).catch((err) => {
    res
      .status(500)
      .json({ message: "An error in finding the user occurred", error: err });
  });
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
