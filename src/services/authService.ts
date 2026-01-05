import { User, LoginCredentials } from '../types/auth';

const USERS_STORAGE_KEY = 'users';
const CURRENT_USER_STORAGE_KEY = 'currentUser';

// Admin predeterminado
const DEFAULT_ADMIN: User = {
  id: '1',
  email: 'kevin.sarango@unl.edu.ec',
  password: 'admin123',
  fullName: 'Administrador',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

export const authService = {
  // Inicializar datos por defecto
  initialize: () => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    if (!users) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEFAULT_ADMIN]));
    }
  },

  // Obtener todos los usuarios
  getAllUsers: (): User[] => {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [DEFAULT_ADMIN];
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<User | null> => {
    const users = authService.getAllUsers();
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (user) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    // También buscar en pacientes con credenciales
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const patientUser = patients.find((p: any) => p.email === credentials.email && p.password === credentials.password);
    
    if (patientUser) {
      const patientAsUser: User = {
        id: patientUser.id,
        email: patientUser.email,
        password: patientUser.password,
        fullName: `${patientUser.firstName} ${patientUser.lastName}`,
        role: 'patient',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(patientAsUser));
      return patientAsUser;
    }

    return null;
  },

  // Logout
  logout: () => {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  },

  // Obtener usuario actual
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Registrar nutricionista
  registerNutritionist: (userData: Omit<User, 'id' | 'createdAt'>): User => {
    const users = authService.getAllUsers();
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return newUser;
  },

  // Obtener nutricionistas
  getNutritionists: (): User[] => {
    const users = authService.getAllUsers();
    return users.filter(u => u.role === 'nutritionist');
  },

  // Eliminar nutricionista
  deleteNutritionist: (id: string): boolean => {
    let users = authService.getAllUsers();
    const initialLength = users.length;
    users = users.filter(u => u.id !== id);
    
    if (users.length < initialLength) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      return true;
    }
    return false;
  },

  // Actualizar nutricionista
  updateNutritionist: (id: string, updates: Partial<User>): User | null => {
    const users = authService.getAllUsers();
    const index = users.findIndex(u => u.id === id);
    
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      return users[index];
    }
    return null;
  },
};
