export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'nutritionist';
  specialization?: string;
  phone?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
}
