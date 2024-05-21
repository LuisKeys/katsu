const authUser = function (user, password) {

  if(user === process.env.AUTH_USER && password === process.env.AUTH_PASSWORD) {
    return true;
  }

  return false;
}

module.exports = { authUser };