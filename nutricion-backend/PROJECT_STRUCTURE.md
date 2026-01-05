# 📊 Estructura del Proyecto Backend

```
nutricion-backend/
│
├── 📄 pom.xml                          # Dependencias Maven
├── 📄 README.md                        # Documentación completa
├── 📄 QUICK_START.md                   # Guía de inicio rápido
├── 📄 run.bat                          # Script para ejecutar (Windows)
├── 📄 run.sh                           # Script para ejecutar (Linux/Mac)
├── 📄 .gitignore
│
└── src/
    ├── main/
    │   ├── java/com/nutricion/
    │   │   │
    │   │   ├── 🔐 config/
    │   │   │   ├── SecurityConfig.java         # Configuración Spring Security + JWT
    │   │   │   └── JwtAuthenticationFilter.java # Filtro JWT para cada request
    │   │   │
    │   │   ├── 🔒 security/
    │   │   │   ├── JwtTokenProvider.java       # Generador/Validador de JWT
    │   │   │   └── CustomUserDetailsService.java # Cargador de usuarios
    │   │   │
    │   │   ├── 📦 entity/
    │   │   │   ├── Patient.java               # Entidad paciente (JPA)
    │   │   │   ├── ClinicalHistory.java       # Entidad historial clínico
    │   │   │   ├── Biometrics.java            # Entidad datos biométricos
    │   │   │   ├── Anthropometry.java         # Entidad antropometría
    │   │   │   └── User.java                  # Entidad usuario/nutricionista
    │   │   │
    │   │   ├── 🗄️ repository/
    │   │   │   ├── PatientRepository.java     # CRUD pacientes
    │   │   │   ├── ClinicalHistoryRepository.java
    │   │   │   ├── BiometricsRepository.java
    │   │   │   ├── AnthropometryRepository.java
    │   │   │   └── UserRepository.java        # CRUD usuarios
    │   │   │
    │   │   ├── 🔧 service/
    │   │   │   ├── PatientService.java        # Lógica de pacientes
    │   │   │   │   ├── createPatient()
    │   │   │   │   ├── getPatientById()
    │   │   │   │   ├── updateClinicalHistory()
    │   │   │   │   ├── updateBiometrics()
    │   │   │   │   └── updateAnthropometry()
    │   │   │   │
    │   │   │   └── AuthService.java           # Lógica de autenticación
    │   │   │       ├── login()
    │   │   │       ├── createNutritionist()
    │   │   │       └── initializeDefaultAdmin()
    │   │   │
    │   │   ├── 🌐 controller/
    │   │   │   ├── AuthController.java        # Endpoint: POST /api/auth/login
    │   │   │   │
    │   │   │   └── PatientController.java     # Endpoints pacientes
    │   │   │       ├── POST   /api/patients
    │   │   │       ├── GET    /api/patients
    │   │   │       ├── GET    /api/patients/{id}
    │   │   │       ├── PUT    /api/patients/{id}
    │   │   │       ├── DELETE /api/patients/{id}
    │   │   │       ├── PUT    /api/patients/{id}/history
    │   │   │       ├── PUT    /api/patients/{id}/biometrics
    │   │   │       └── PUT    /api/patients/{id}/anthropometry
    │   │   │
    │   │   ├── 📋 dto/
    │   │   │   ├── PatientDTO.java
    │   │   │   ├── ClinicalHistoryDTO.java
    │   │   │   ├── BiometricsDTO.java
    │   │   │   ├── AnthropometryDTO.java
    │   │   │   ├── LoginRequest.java
    │   │   │   └── LoginResponse.java
    │   │   │
    │   │   └── 🚀 NutricionBackendApplication.java  # Main class
    │   │
    │   └── resources/
    │       └── 📝 application.yml              # Configuración app
    │           ├── spring.datasource    (PostgreSQL)
    │           ├── spring.jpa           (Hibernate)
    │           ├── server.port          (8080)
    │           └── jwt.secret, jwt.expiration
    │
    └── test/                           # Tests (vacío por ahora)
```

---

## 🔄 Flujo de Datos

```
CLIENTE (React/Frontend)
        ↓
[POST /api/auth/login]
        ↓
    AuthController
        ↓
    AuthService
        ↓
    UserRepository (PostgreSQL)
        ↓
    JwtTokenProvider (genera token)
        ↓
    LoginResponse (token + datos usuario)
        ↓
CLIENTE (guarda token en localStorage)
        ↓
[GET /api/patients + Authorization Bearer Token]
        ↓
    JwtAuthenticationFilter (valida token)
        ↓
    PatientController
        ↓
    PatientService
        ↓
    PatientRepository (consulta DB)
        ↓
    PatientDTO (JSON response)
        ↓
CLIENTE (recibe datos)
```

---

## 🗂️ Relaciones en Base de Datos

```
┌─────────────────────────────────────────────────┐
│              PostgreSQL (nutricion_db)           │
└─────────────────────────────────────────────────┘
         ↓
┌─ patients ────────────────────────────────┐
│ id (PK)                                   │
│ firstName, lastName                       │
│ email (UNIQUE), phone                     │
│ dateOfBirth, gender                       │
│ address, occupation                       │
│ clinical_history_id (FK)                  │
│ biometrics_id (FK)                        │
│ anthropometry_id (FK)                     │
│ created_at                                │
└───────────────────────────────────────────┘
    ↓           ↓            ↓
    │           │            │
    ↓           ↓            ↓
┌────────┐ ┌──────────┐ ┌─────────────┐
│clinical│ │biometrics│ │anthropometry│
│history │ │          │ │             │
│        │ │          │ │             │
│30+ cols│ │28 fields │ │17 fields    │
└────────┘ └──────────┘ └─────────────┘

┌─ users ──────────────────────────────────┐
│ id (PK)                                  │
│ email (UNIQUE)                           │
│ password (encoded)                       │
│ firstName, lastName                      │
│ role (ADMIN / NUTRITIONIST)              │
│ active (boolean)                         │
└──────────────────────────────────────────┘
```

---

## 🔐 Seguridad

```
REQUEST LIFECYCLE:
    ↓
[JwtAuthenticationFilter]
    ├─ Extrae token del header "Authorization: Bearer XXX"
    ├─ Valida firma JWT
    ├─ Extrae email del payload
    ├─ Carga detalles del usuario
    └─ Establece Authentication en SecurityContext
    ↓
[Controller Method]
    ├─ @PreAuthorize("hasRole('NUTRITIONIST')")
    ├─ Se verifica el rol
    └─ Se ejecuta el método si tiene permisos
    ↓
RESPONSE
```

---

## 📊 Estadísticas del Proyecto

| Elemento | Cantidad |
|----------|----------|
| **Entity Classes** | 5 |
| **Repository Classes** | 5 |
| **Service Classes** | 2 |
| **Controller Classes** | 2 |
| **DTO Classes** | 6 |
| **Configuration Files** | 2 |
| **REST Endpoints** | 8 |
| **Database Tables** | 5 |
| **Fields en Biometrics** | 28 |
| **Fields en Anthropometry** | 17 |

---

## 🚀 Tecnologías Utilizadas

| Capa | Tecnología |
|------|-----------|
| **Framework** | Spring Boot 3.2.0 |
| **Base de Datos** | PostgreSQL 12+ |
| **ORM** | Hibernate (JPA) |
| **Autenticación** | Spring Security + JWT |
| **API** | REST + OpenAPI/Swagger |
| **Build** | Maven 3.6+ |
| **Java** | 17 LTS |
| **Documentación** | SpringDoc OpenAPI |

---

## 🔄 Ciclo de Desarrollo

```
1. MODIFICAR ENTIDAD (entity/*.java)
        ↓
2. ACTUALIZAR REPOSITORY (si es necesario)
        ↓
3. ACTUALIZAR DTO (dto/*.java)
        ↓
4. ACTUALIZAR SERVICE (service/*.java)
        ↓
5. ACTUALIZAR CONTROLLER (controller/*.java)
        ↓
6. PROBAR EN SWAGGER: http://localhost:8080/swagger-ui.html
        ↓
7. COMMIT Y PUSH
```

---

## 📝 Notas Importantes

- ✅ Auto-cálculo de IMC en Anthropometry
- ✅ Auto-cálculo de WHR (Waist-Hip Ratio)
- ✅ JWT con expiración de 24 horas
- ✅ CORS configurado para http://localhost:5173 (React)
- ✅ Password encoding con BCrypt
- ✅ Transacciones ACID en todas las operaciones
- ✅ Swagger UI para documentación interactiva
- ✅ Lazy loading desactivado en JPA
