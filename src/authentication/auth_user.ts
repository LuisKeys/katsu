import { KatsuState } from '../db/katsu_db/katsu_state';

const authUser = function (email: string, password: string, state: KatsuState): boolean {
  for (const user of state.users) {
    if (user.email === email) {
      return user.password === password;
    }
  }
  return false;
}



export { authUser };
