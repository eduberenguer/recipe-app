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

export interface ApiResponse {
  success: boolean;
  user: User;
  token: string;
  isAuthenticated: boolean;
}

export interface UserRegisterCredentials {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}
