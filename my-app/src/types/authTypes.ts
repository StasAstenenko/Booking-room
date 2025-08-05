export interface User {
  email: string;
  password: string;
}

export interface RegUser extends User {
  name: string;
}
