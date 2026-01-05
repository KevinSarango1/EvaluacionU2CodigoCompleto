# 🎯 API Reference Card - Backend Nutrición

## 🔑 Autenticación

### POST /api/auth/login
Autentica usuario y retorna JWT token

**Request:**
```json
{
  "email": "kevin.sarango@unl.edu.ec",
  "password": "admin123"
}
```

**Response:** (201 Created)
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "email": "kevin.sarango@unl.edu.ec",
  "firstName": "Kevin",
  "lastName": "Sarango",
  "role": "ADMIN"
}
```

**Headers Requeridos:**
```
Content-Type: application/json
```

**Errores:**
- 400 Bad Request: Email/contraseña inválidos
- 401 Unauthorized: Credenciales incorrectas

---

## 👥 Pacientes

### POST /api/patients
Crea un nuevo paciente

**Request:**
```json
{
  "firstName": "Carlos",
  "lastName": "García",
  "email": "carlos@example.com",
  "phone": "0999888777",
  "dateOfBirth": "1985-05-20",
  "gender": "M",
  "address": "Av. Principal 456",
  "occupation": "Doctor"
}
```

**Response:** (201 Created)
```json
{
  "id": 1,
  "firstName": "Carlos",
  "lastName": "García",
  "email": "carlos@example.com",
  "phone": "0999888777",
  "dateOfBirth": "1985-05-20",
  "gender": "M",
  "address": "Av. Principal 456",
  "occupation": "Doctor",
  "createdAt": "2024-12-11",
  "clinicalHistory": null,
  "biometrics": null,
  "anthropometry": null
}
```

**Headers Requeridos:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Permisos:** NUTRITIONIST, ADMIN

**Errores:**
- 401 Unauthorized: Sin autenticación
- 403 Forbidden: Rol insuficiente

---

### GET /api/patients
Obtiene lista de todos los pacientes

**Response:** (200 OK)
```json
[
  {
    "id": 1,
    "firstName": "Carlos",
    "lastName": "García",
    "email": "carlos@example.com",
    ...
  },
  {
    "id": 2,
    "firstName": "María",
    "lastName": "López",
    ...
  }
]
```

**Headers Requeridos:**
```
Authorization: Bearer <token>
```

**Permisos:** NUTRITIONIST, ADMIN

---

### GET /api/patients/{id}
Obtiene un paciente específico

**Path Parameters:**
- `id` (required): ID del paciente (number)

**Response:** (200 OK)
```json
{
  "id": 1,
  "firstName": "Carlos",
  "lastName": "García",
  "email": "carlos@example.com",
  "phone": "0999888777",
  "dateOfBirth": "1985-05-20",
  "gender": "M",
  "address": "Av. Principal 456",
  "occupation": "Doctor",
  "createdAt": "2024-12-11",
  "clinicalHistory": {...},
  "biometrics": {...},
  "anthropometry": {...}
}
```

**Headers Requeridos:**
```
Authorization: Bearer <token>
```

**Permisos:** NUTRITIONIST, ADMIN

**Errores:**
- 404 Not Found: Paciente no existe

---

### PUT /api/patients/{id}
Actualiza datos personales del paciente

**Path Parameters:**
- `id` (required): ID del paciente

**Request:**
```json
{
  "firstName": "Carlos",
  "lastName": "García López",
  "phone": "0998765432",
  "dateOfBirth": "1985-05-20",
  "gender": "M",
  "address": "Calle Nueva 789",
  "occupation": "Ingeniero"
}
```

**Response:** (200 OK) - Paciente actualizado

**Headers Requeridos:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Permisos:** NUTRITIONIST, ADMIN

---

### DELETE /api/patients/{id}
Elimina un paciente (solo ADMIN)

**Path Parameters:**
- `id` (required): ID del paciente

**Response:** (204 No Content) - Éxito sin cuerpo

**Headers Requeridos:**
```
Authorization: Bearer <token>
```

**Permisos:** ADMIN solamente

**Errores:**
- 403 Forbidden: No eres ADMIN

---

## 📋 Historial Clínico

### PUT /api/patients/{id}/history
Actualiza el historial clínico de un paciente

**Path Parameters:**
- `id` (required): ID del paciente

**Request:**
```json
{
  "medicalHistory": "Hipertensión controlada",
  "surgicalHistory": "Apendicectomía 2010",
  "familyHistory": "Padre diabético, madre hipertensa",
  "pastDiseases": "Varicela, sarampión",
  "complaint": "Quiero mejorar mi peso",
  "dietaryHabits": "Come mucho pan y azúcares",
  "physicalActivity": "Sedentario, no hace ejercicio",
  "alcoholConsumption": "No consume",
  "tobaccoUse": "Fumador activo (10 cigarrillos/día)",
  "currentMedications": "Losartán 100mg diarios",
  "allergies": "Penicilina",
  "foodIntolerances": "Lactosa, gluten",
  "nutritionalGoal": "Alcanzar BMI de 25",
  "dietaryRestrictions": "Bajo en sodio",
  "notes": "Seguimiento cada 2 semanas"
}
```

**Response:** (200 OK) - Paciente con historial actualizado

**Headers Requeridos:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Permisos:** NUTRITIONIST, ADMIN

---

## 🔬 Biometría

### PUT /api/patients/{id}/biometrics
Actualiza parámetros biométricos

**Path Parameters:**
- `id` (required): ID del paciente

**Request:**
```json
{
  "glucose": 110.5,
  "hemoglobinA1c": 6.2,
  "totalCholesterol": 200,
  "ldlCholesterol": 130,
  "hdlCholesterol": 45,
  "triglycerides": 150,
  "vldlCholesterol": 30,
  "ast": 35,
  "alt": 28,
  "ggt": 42,
  "bilirubin": 0.8,
  "creatinine": 1.0,
  "bun": 18,
  "totalProteins": 7.2,
  "albumin": 4.5,
  "prealbumin": 25,
  "hemoglobin": 14.5,
  "hematocrit": 42,
  "whiteBloodCells": 7.5,
  "platelets": 250,
  "vitaminB12": 500,
  "folacin": 12,
  "iron": 80,
  "ferritin": 120,
  "zinc": 90,
  "calcium": 9.5,
  "magnesium": 2.3,
  "phosphorus": 3.8,
  "measuredDate": "2024-12-11"
}
```

**Response:** (200 OK) - Paciente con biometría actualizada

**Headers Requeridos:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Permisos:** NUTRITIONIST, ADMIN

**Campos Opcionales:** Puedes enviar solo los que tengas

---

## 📏 Antropometría

### PUT /api/patients/{id}/anthropometry
Actualiza medidas antropométricas (auto-calcula IMC y WHR)

**Path Parameters:**
- `id` (required): ID del paciente

**Request:**
```json
{
  "weight": 75.5,
  "height": 1.75,
  "waistCircumference": 90,
  "hipCircumference": 100,
  "armCircumference": 32,
  "thighCircumference": 55,
  "tricepsSkinFold": 20,
  "bicepsSkinFold": 15,
  "subscapularSkinFold": 25,
  "suprailiacSkinFold": 18,
  "muscleMass": 60,
  "boneMass": 3.5,
  "waterPercentage": 60,
  "fatPercentage": 20,
  "measuredDate": "2024-12-11"
}
```

**Response:** (200 OK) - Paciente con antropometría actualizada
```json
{
  ...paciente,
  "anthropometry": {
    "weight": 75.5,
    "height": 1.75,
    "bmi": 24.6,                    // Auto-calculado
    "waistHipRatio": 0.9,           // Auto-calculado
    ...
  }
}
```

**Headers Requeridos:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Permisos:** NUTRITIONIST, ADMIN

**Auto-Cálculos:**
- IMC = weight (kg) / height² (m²)
- WHR = waist / hip

---

## 🔑 Header Authorization

Para TODOS los endpoints excepto `/api/auth/login`:

```
Authorization: Bearer <tu_token_jwt>
```

Ejemplo completo:
```
Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJrZXZpbi5zYXJhbmdvQHVubC5lZHUuZWMiLCJmaXJzdE5hbWUiOiJLZXZpbiIsImxhc3ROYW1lIjoiU2FyYW5nbyIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTczMzk1NDAwMCwiZXhwIjoxNzMzOTk3MjAwfQ.xyz123...
```

---

## 🔴 Códigos HTTP

| Código | Significado |
|--------|------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 204 | No Content - Éxito sin respuesta |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Sin autenticación |
| 403 | Forbidden - Rol insuficiente |
| 404 | Not Found - Recurso no existe |
| 500 | Server Error - Error interno |

---

## 🛡️ Permisos por Endpoint

| Endpoint | ADMIN | NUTRITIONIST |
|----------|-------|--------------|
| POST /auth/login | ✅ | ✅ |
| POST /patients | ✅ | ✅ |
| GET /patients | ✅ | ✅ |
| GET /patients/{id} | ✅ | ✅ |
| PUT /patients/{id} | ✅ | ✅ |
| DELETE /patients/{id} | ✅ | ❌ |
| PUT /patients/{id}/history | ✅ | ✅ |
| PUT /patients/{id}/biometrics | ✅ | ✅ |
| PUT /patients/{id}/anthropometry | ✅ | ✅ |

---

## 📱 Ejemplo Completo (cURL)

```bash
# 1. Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"kevin.sarango@unl.edu.ec","password":"admin123"}'

# Respuesta: {"token":"eyJ...","email":"...","firstName":"Kevin",...}
# GUARDAR TOKEN: ABC123TOKEN

# 2. Crear paciente
curl -X POST http://localhost:8080/api/patients \
  -H "Authorization: Bearer ABC123TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Juan",
    "lastName":"Pérez",
    "email":"juan@example.com",
    "phone":"0999999999",
    "dateOfBirth":"1990-01-15",
    "gender":"M",
    "address":"Calle 1",
    "occupation":"Ingeniero"
  }'

# Respuesta: {"id":1,"firstName":"Juan",...}
# GUARDAR ID: 1

# 3. Actualizar historial
curl -X PUT http://localhost:8080/api/patients/1/history \
  -H "Authorization: Bearer ABC123TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"medicalHistory":"Hipertensión","dietaryHabits":"Sedentario",...}'

# 4. Obtener paciente
curl -X GET http://localhost:8080/api/patients/1 \
  -H "Authorization: Bearer ABC123TOKEN"
```

---

## 🧪 Probar en Swagger UI

1. Abre: http://localhost:8080/swagger-ui.html
2. Busca el endpoint que quieres probar
3. Haz clic en "Try it out"
4. Rellena los campos
5. Haz clic en "Execute"
6. Ver respuesta

---

## 📚 Ver Documentación Completa

- **README.md** - Guía general
- **QUICK_START.md** - Inicio rápido
- **PROJECT_STRUCTURE.md** - Arquitectura
- **INTEGRATION_GUIDE.md** - Integración React
- **WINDOWS_SETUP.md** - Setup en Windows

---

**Última actualización:** Diciembre 11, 2024
**API Version:** 1.0.0
