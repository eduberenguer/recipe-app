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

export interface Recipe {
  id: string;
  owner: string;
  name: string;
  tupperwares: number;
  ingredients: { name: string; quantity: number }[];
  photo: File;
}
