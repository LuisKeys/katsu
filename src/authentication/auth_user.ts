const authUser = function (user: string, password: string): boolean {
  if (user === process.env.AUTH_USER && password === process.env.AUTH_PASSWORD) {
    return true;
  }

  return false;
}

export { authUser };
