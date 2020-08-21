export interface User {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  roles?: any[];
}
