export interface User {
  id: string;
  email: string;
  name: string;
  created: string;
  updated: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserWithName {
  id: string;
  name: string;
}
