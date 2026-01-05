# 🔗 Integración Frontend-Backend

Este documento muestra cómo integrar el backend Spring Boot con la aplicación React.

## 1️⃣ Configurar URL Base en React

En tu proyecto React, crea un archivo `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  // Autenticación
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error('Login falló');
      return response.json();
    }
  },

  // Pacientes
  patients: {
    create: async (patient: PatientDTO, token: string) => {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(patient)
      });
      if (!response.ok) throw new Error('Error creando paciente');
      return response.json();
    },

    getAll: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Error obteniendo pacientes');
      return response.json();
    },

    getById: async (id: number, token: string) => {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Paciente no encontrado');
      return response.json();
    },

    update: async (id: number, patient: PatientDTO, token: string) => {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(patient)
      });
      if (!response.ok) throw new Error('Error actualizando paciente');
      return response.json();
    },

    delete: async (id: number, token: string) => {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Error eliminando paciente');
    },

    updateClinicalHistory: async (
      id: number,
      history: ClinicalHistoryDTO,
      token: string
    ) => {
      const response = await fetch(`${API_BASE_URL}/patients/${id}/history`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(history)
      });
      if (!response.ok) throw new Error('Error actualizando historial');
      return response.json();
    },

    updateBiometrics: async (
      id: number,
      biometrics: BiometricsDTO,
      token: string
    ) => {
      const response = await fetch(`${API_BASE_URL}/patients/${id}/biometrics`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(biometrics)
      });
      if (!response.ok) throw new Error('Error actualizando biometría');
      return response.json();
    },

    updateAnthropometry: async (
      id: number,
      anthropometry: AnthropometryDTO,
      token: string
    ) => {
      const response = await fetch(`${API_BASE_URL}/patients/${id}/anthropometry`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(anthropometry)
      });
      if (!response.ok) throw new Error('Error actualizando antropometría');
      return response.json();
    }
  }
};
```

## 2️⃣ Actualizar el Contexto de Autenticación

En `src/context/AuthContext.tsx`:

```typescript
import { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(
    () => JSON.parse(localStorage.getItem('user') || 'null')
  );
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token')
  );

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login(email, password);
      setToken(response.token);
      setUser(response);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## 3️⃣ Actualizar PatientService

En `src/services/patientService.ts`:

```typescript
import { api } from './api';
import { useAuth } from '../context/AuthContext';

export const PatientService = {
  createPatient: async (patient: PatientDTO) => {
    const { token } = useAuth();
    if (!token) throw new Error('No token');
    return api.patients.create(patient, token);
  },

  getAllPatients: async () => {
    const { token } = useAuth();
    if (!token) throw new Error('No token');
    return api.patients.getAll(token);
  },

  getPatientById: async (id: number) => {
    const { token } = useAuth();
    if (!token) throw new Error('No token');
    return api.patients.getById(id, token);
  },

  updatePatient: async (id: number, patient: PatientDTO) => {
    const { token } = useAuth();
    if (!token) throw new Error('No token');
    return api.patients.update(id, patient, token);
  },

  deletePatient: async (id: number) => {
    const { token } = useAuth();
    if (!token) throw new Error('No token');
    return api.patients.delete(id, token);
  },

  updateClinicalHistory: async (
    id: number,
    history: ClinicalHistoryDTO
  ) => {
    const { token } = useAuth();
    if (!token) throw new Error('No token');
    return api.patients.updateClinicalHistory(id, history, token);
  },

  updateBiometrics: async (id: number, biometrics: BiometricsDTO) => {
    const { token } = useAuth();
    if (!token) throw new Error('No token');
    return api.patients.updateBiometrics(id, biometrics, token);
  },

  updateAnthropometry: async (
    id: number,
    anthropometry: AnthropometryDTO
  ) => {
    const { token } = useAuth();
    if (!token) throw new Error('No token');
    return api.patients.updateAnthropometry(id, anthropometry, token);
  }
};
```

## 4️⃣ Actualizar Componentes

### Login.tsx

```typescript
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('kevin.sarango@unl.edu.ec');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      // Redirigir a dashboard
      window.location.href = '/';
    } catch (err) {
      setError('Error en autenticación. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Autenticando...' : 'Entrar'}
      </button>
    </form>
  );
};
```

### PatientForm.tsx (Crear)

```typescript
import { useState } from 'react';
import { PatientService } from '../services/patientService';

export const PatientForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<PatientDTO>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'M',
    address: '',
    occupation: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const patient = await PatientService.createPatient(formData);
      alert(`Paciente ${patient.firstName} creado exitosamente`);
      // Limpiar formulario o redirigir
    } catch (err) {
      setError('Error creando paciente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="Nombre"
        required
      />
      <input
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Apellido"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Teléfono"
        required
      />
      {/* ... más campos ... */}
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Paciente'}
      </button>
    </form>
  );
};
```

## 5️⃣ Cambios en App.tsx

```typescript
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
```

## 6️⃣ Variables de Entorno (opcional)

En `.env`:

```
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=Nutrición App
```

Usa en el código:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL;
```

## 7️⃣ Verificar Conectividad

```bash
# Desde tu terminal React:
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"kevin.sarango@unl.edu.ec","password":"admin123"}'
```

Si recives un JSON con token, ¡todo funciona! ✅

---

## ⚠️ Troubleshooting

| Problema | Solución |
|----------|----------|
| CORS error | Backend está en 8080, React en 5173 - ya configurado ✅ |
| 401 Unauthorized | Token inválido o expirado - re-autentica |
| 500 Server Error | Revisa logs del backend en la terminal |
| Network error | Backend no está corriendo - inicia con `mvn spring-boot:run` |

---

## 📚 Próximas Mejoras

- [ ] Interceptor de errores en React
- [ ] Refresh token automático
- [ ] Offline mode con sincronización
- [ ] Caché local de pacientes
- [ ] Notificaciones en tiempo real (WebSocket)
