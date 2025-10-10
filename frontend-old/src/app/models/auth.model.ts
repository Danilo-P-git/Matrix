export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  roles?: Role[];
  all_permissions?: Permission[];
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  device_name?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  device_name?: string;
}
