# Especificación de Interfaces y APIs - NutriApp

## 🔗 Arquitectura de Servicios

La comunicación entre el Frontend (React + Vite) y el Backend (Spring Boot) se realiza mediante una arquitectura orientada a servicios REST, con las siguientes consideraciones:

- **URL Base:** `http://localhost:8080/api/`
- **Formato de Datos:** JSON
- **Autenticación:** JWT Token (Bearer Token)
- **Headers Requeridos:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>` (excepto en login)

---

## 📋 Especificación de Endpoints

### 1. Autenticación

| Endpoint | Método | Detalle |
|----------|--------|---------|
| `/auth/login` | POST | Autentica usuario (Nutricionista, Admin, Paciente) y retorna JWT Token |
| `/auth/logout` | POST | Cierra sesión del usuario actual |
| `/auth/validate` | GET | Valida si el JWT Token es válido |

**Ejemplo de Request `/auth/login`:**
```json
{
  "email": "nutricionista@sistema.com",
  "password": "contraseña123"
}
```

**Ejemplo de Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "nutricionista@sistema.com",
    "fullName": "Juan Pérez",
    "role": "nutritionist"
  }
}
```

---

### 2. Gestión de Pacientes

| Endpoint | Método | Detalle |
|----------|--------|---------|
| `/patients` | GET | Lista todos los pacientes asignados al nutricionista |
| `/patients` | POST | Registra un nuevo paciente |
| `/patients/{id}` | GET | Obtiene datos detallados de un paciente específico |
| `/patients/{id}` | PUT | Actualiza información personal del paciente |
| `/patients/{id}` | DELETE | Desactiva un paciente |

**Ejemplo de Request POST `/patients`:**
```json
{
  "firstName": "Carlos",
  "lastName": "García",
  "email": "carlos@correo.com",
  "phone": "3001234567",
  "dateOfBirth": "1990-05-15",
  "gender": "M",
  "password": "contraseña_temporal"
}
```

---

### 3. Historia Clínica Nutricional

| Endpoint | Método | Detalle |
|----------|--------|---------|
| `/patients/{patientId}/history` | GET | Obtiene la historia clínica completa del paciente |
| `/patients/{patientId}/history` | PUT | Registra o actualiza la historia clínica |

**Ejemplo de Request PUT `/patients/{patientId}/history`:**
```json
{
  "date": "2026-01-05",
  "medicalHistory": "Diabetes tipo 2, Hipertensión",
  "surgicalHistory": "Apendicectomía 2010",
  "familyHistory": "Padre con diabetes",
  "currentComplaints": "Fatiga y sed constante",
  "dietaryHabits": "Consume bebidas azucaradas frecuentemente",
  "physicalActivity": "Sedentario",
  "alcoholConsumption": "Ocasional",
  "tobaccoUse": "No",
  "currentMedications": ["Metformina", "Losartán"],
  "allergies": ["Penicilina"],
  "foodIntolerances": ["Lactosa"],
  "nutritionalObjective": "Reducir glucosa en sangre y controlar peso",
  "dietaryRestrictions": "Sin azúcar refinado, bajo en sodio"
}
```

---

### 4. Datos Bioquímicos

| Endpoint | Método | Detalle |
|----------|--------|---------|
| `/patients/{patientId}/biometrics` | GET | Obtiene histórico de datos bioquímicos |
| `/patients/{patientId}/biometrics` | POST | Registra nuevos resultados de laboratorio |
| `/patients/{patientId}/biometrics/{biometricId}` | PUT | Actualiza datos bioquímicos específicos |

**Ejemplo de Request POST `/patients/{patientId}/biometrics`:**
```json
{
  "testDate": "2026-01-05",
  "glucose": 145,
  "hba1c": 7.2,
  "totalCholesterol": 220,
  "ldl": 150,
  "hdl": 35,
  "triglycerides": 180,
  "hemoglobin": 14.5,
  "hematocrit": 43.5,
  "albumin": 3.8,
  "ast": 25,
  "alt": 30,
  "creatinine": 0.95,
  "totalProteins": 7.0,
  "vitaminB12": 450,
  "iron": 70,
  "ferritin": 100,
  "zinc": 8.5,
  "calcium": 9.2,
  "magnesium": 2.1,
  "phosphorus": 3.5
}
```

---

### 5. Datos Antropométricos

| Endpoint | Método | Detalle |
|----------|--------|---------|
| `/patients/{patientId}/anthropometry` | GET | Obtiene histórico de medidas antropométricas |
| `/patients/{patientId}/anthropometry` | POST | Registra nuevas medidas antropométricas |
| `/patients/{patientId}/anthropometry/{anthropometryId}` | PUT | Actualiza medidas antropométricas |

**Ejemplo de Request POST `/patients/{patientId}/anthropometry`:**
```json
{
  "measurementDate": "2026-01-05",
  "weight": 92.5,
  "height": 175,
  "bmi": 30.1,
  "waistCircumference": 95,
  "hipCircumference": 105,
  "waistHipRatio": 0.90,
  "armCircumference": 32,
  "thighCircumference": 60,
  "tricepsSkinfold": 25,
  "bicepsSkinfold": 12,
  "subscapularSkinfold": 28,
  "suprailiacSkinfold": 22,
  "bodyFatPercentage": 32.5,
  "muscleMass": 58.2,
  "boneMass": 3.8,
  "waterPercentage": 55.3
}
```

---

### 6. Plan Nutricional Semanal

| Endpoint | Método | Detalle |
|----------|--------|---------|
| `/patients/{patientId}/weekly-menu` | GET | Obtiene el menú semanal asignado |
| `/patients/{patientId}/weekly-menu` | POST | Crea o asigna un nuevo menú semanal |
| `/patients/{patientId}/weekly-menu` | PUT | Actualiza el menú semanal |

**Ejemplo de Request POST `/patients/{patientId}/weekly-menu`:**
```json
{
  "weekStartDate": "2026-01-06",
  "monday": "Arroz integral, pollo a la plancha, ensalada verde",
  "tuesday": "Pasta integral, salmón al horno, brócoli",
  "wednesday": "Quinoa, pechuga de pavo, espinacas",
  "thursday": "Papas cocidas, lentejas, zanahoria",
  "friday": "Arroz blanco, pechuga de pollo, aguacate",
  "saturday": "Batata, huevo cocido, espárragos",
  "sunday": "Avena, yogur griego, frutas rojas",
  "observations": "Bajo en sodio, sin azúcares refinados. Distribuir comidas cada 4 horas."
}
```

---

### 7. Administración (Admin Panel)

| Endpoint | Método | Detalle |
|----------|--------|---------|
| `/admin/nutritionists` | GET | Lista todos los nutricionistas del sistema |
| `/admin/nutritionists` | POST | Registra un nuevo nutricionista |
| `/admin/nutritionists/{id}` | PUT | Actualiza datos de nutricionista |
| `/admin/nutritionists/{id}` | DELETE | Desactiva un nutricionista |
| `/admin/users` | GET | Lista todos los usuarios del sistema |

**Ejemplo de Request POST `/admin/nutritionists`:**
```json
{
  "fullName": "Dra. María López",
  "email": "maria.lopez@nutricionista.com",
  "password": "contraseña_segura",
  "specialization": "Nutrición Clínica",
  "phone": "3105678901"
}
```

---

## 🔐 Códigos de Respuesta HTTP

| Código | Significado | Descripción |
|--------|------------|-------------|
| `200` | OK | La solicitud se procesó correctamente |
| `201` | Created | El recurso fue creado exitosamente |
| `204` | No Content | Solicitud exitosa sin contenido de retorno |
| `400` | Bad Request | Error en los parámetros enviados |
| `401` | Unauthorized | Token JWT inválido o expirado |
| `403` | Forbidden | Acceso denegado (insuficientes permisos) |
| `404` | Not Found | Recurso no encontrado |
| `409` | Conflict | Conflicto (ej: email duplicado) |
| `500` | Server Error | Error interno del servidor |

---

## 📝 Estructura de Errores

**Ejemplo de Response de Error:**
```json
{
  "status": 400,
  "error": "Validación fallida",
  "message": "Email ya está registrado en el sistema",
  "timestamp": "2026-01-05T14:30:00Z"
}
```

---

## 🔒 Autenticación y Autorización

### Flujo de Autenticación:
1. Usuario envía email y contraseña al endpoint `/auth/login`
2. Backend valida credenciales contra base de datos
3. Si son válidas, genera JWT Token con información del usuario
4. Frontend almacena token en localStorage
5. Todos los requests posteriores incluyen: `Authorization: Bearer <token>`
6. Backend valida token en cada solicitud

### Roles y Permisos:

| Rol | Permisos |
|-----|----------|
| **Admin** | Gestionar nutricionistas, ver todos los pacientes, acceso total al sistema |
| **Nutricionista** | Crear/editar pacientes, registrar datos clínicos, asignar menús |
| **Paciente** | Ver su propio perfil, ver su menú semanal, actualizar datos personales |

---

## 🔄 Ciclo de Vida de una Solicitud API

1. **Cliente (Frontend)** envía solicitud HTTP con JWT token
2. **Spring Boot** recibe la solicitud en el Controller
3. **Filtro JWT** valida el token y los permisos
4. **Service** procesa la lógica de negocio
5. **Repository** accede a la base de datos (JPA/Hibernate)
6. **BD** ejecuta la consulta SQL
7. Response retorna al cliente en formato JSON

---

## 📚 Documentación Adicional

Para pruebas interactivas de los endpoints, se puede usar:
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **Postman:** Importar colección de requests
- **cURL:** Desde línea de comandos

```bash
# Ejemplo de login con cURL
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nutricionista@sistema.com","password":"contraseña123"}'
```

