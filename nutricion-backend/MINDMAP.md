# 🗺️ MAPA MENTAL - Backend Nutrición

```
                         NUTRICIÓN BACKEND
                              │
                ┌─────────────┼─────────────┐
                │             │             │
            FRONTEND       BACKEND      DATABASE
              React       Spring Boot   PostgreSQL
              (5173)       (8080)       (5432)
                │             │             │
                │             │             │
            ┌───┴─────┐       │       ┌─────┴──┐
            │          │      │       │        │
        Login   Patient  │      │   Users  Patients
        Form    CRUD     │      │
                │      │       │
                │      └───────┼────────────────┐
                │              │                │
             Token ←────── JWT Auth Service     │
                │              │                │
                │      ┌────────┼────────┐      │
                │      │        │        │      │
                │   PatientService    Biometrics
                │      │        │        │      
                │   History   UPDATE    │      
                │      │        │        │      
                │   Anthropometry       │      
                │      │                │      
                └──────┴────────────────┘      

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        FLUJO DE AUTENTICACIÓN
        
User Email/Password
        ↓
AuthController.login()
        ↓
AuthService.login()
        ↓
UserRepository.findByEmail()
        ↓
BCrypt.compare(password)
        ↓
JwtTokenProvider.generateToken()
        ↓
Return JWT Token (24h TTL)
        ↓
Frontend stores in localStorage
        ↓
All next requests include: Authorization: Bearer TOKEN

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        FLUJO DE CREACIÓN DE PACIENTE
        
POST /api/patients {patient data}
        ↓
JwtAuthenticationFilter (valida token)
        ↓
PatientController.createPatient()
        ↓
@PreAuthorize("hasAnyRole('NUTRITIONIST','ADMIN')")
        ↓
PatientService.createPatient()
        ↓
Patient entity + ClinicalHistory empty
        ↓
PatientRepository.save()
        ↓
PostgreSQL INSERT
        ↓
Return PatientDTO (JSON)
        ↓
Frontend recibe ID + datos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        ESTRUCTURA DE CLASES
        
┌──────────────────────────────────────┐
│         NutricionBackendApplication  │
│         (Main Class)                 │
└──────┬───────────────────────────────┘
       │
       ├─────────────────────────────────────┐
       │                                     │
   ┌───▼────┐                    ┌──────────▼──────┐
   │  Config │                    │   Controller    │
   ├─────────┤                    ├─────────────────┤
   │Security │◄───────┬──────────►│AuthController   │
   │JWT Auth │        │           │PatientController│
   └─────────┘        │           └─────────────────┘
                      │                    │
                      │           ┌────────▼────────┐
                      │           │   Service       │
                      │           ├─────────────────┤
                      │           │AuthService      │
                      │           │PatientService   │
                      │           └────────┬────────┘
                      │                    │
                      │           ┌────────▼────────┐
                      │           │   Repository    │
                      │           ├─────────────────┤
                      │           │PatientRepository│
                      │           │UserRepository   │
                      │           └────────┬────────┘
                      │                    │
                      │           ┌────────▼────────┐
                      └──────────►│   Entity        │
                                  ├─────────────────┤
                                  │Patient          │
                                  │User             │
                                  │Biometrics       │
                                  │Anthropometry    │
                                  │ClinicalHistory  │
                                  └────────┬────────┘
                                           │
                                  ┌────────▼────────┐
                                  │  PostgreSQL     │
                                  ├─────────────────┤
                                  │5 Tables         │
                                  │70+ Columns      │
                                  │Relationships    │
                                  └─────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        ENDPOINTS (8 TOTAL)
        
AUTENTICACIÓN
  └─ POST /api/auth/login

PACIENTES (CRUD)
  ├─ POST   /api/patients          (Create)
  ├─ GET    /api/patients          (ReadAll)
  ├─ GET    /api/patients/{id}     (ReadOne)
  ├─ PUT    /api/patients/{id}     (Update)
  └─ DELETE /api/patients/{id}     (Delete - ADMIN)

DATOS CLÍNICOS (UPDATE)
  ├─ PUT /api/patients/{id}/history
  ├─ PUT /api/patients/{id}/biometrics
  └─ PUT /api/patients/{id}/anthropometry

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        BASE DE DATOS (PostgreSQL)
        
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ id (PK)         │
│ email (UNIQUE)  │
│ password        │
│ firstName       │
│ lastName        │
│ role            │
│ active          │
└────────┬────────┘
         │ AuthService
         │
┌─────────────────────────────────┐
│          PATIENTS               │
├─────────────────────────────────┤
│ id (PK)                         │
│ firstName, lastName             │
│ email (UNIQUE)                  │
│ phone, dateOfBirth              │
│ gender, address, occupation     │
│ clinical_history_id (FK)    ────┼──► CLINICAL_HISTORIES
│ biometrics_id (FK)         ─────┼──► BIOMETRICS
│ anthropometry_id (FK)      ─────┼──► ANTHROPOMETRY
│ created_at                      │
└─────────────────────────────────┘

┌──────────────────────────┐
│ CLINICAL_HISTORIES       │
├──────────────────────────┤
│ id (PK)                  │
│ medicalHistory (TEXT)    │
│ surgicalHistory (TEXT)   │
│ familyHistory (TEXT)     │
│ complaint (TEXT)         │
│ dietaryHabits (TEXT)     │
│ ... 10 más campos        │
└──────────────────────────┘

┌──────────────────────────┐
│ BIOMETRICS (28 campos)   │
├──────────────────────────┤
│ id (PK)                  │
│ glucose                  │
│ hemoglobinA1c            │
│ totalCholesterol         │
│ ldlCholesterol           │
│ ... 23 más campos        │
│ measuredDate             │
└──────────────────────────┘

┌──────────────────────────┐
│ ANTHROPOMETRY (17 campos)│
├──────────────────────────┤
│ id (PK)                  │
│ weight                   │
│ height                   │
│ bmi (auto-calculado)     │
│ waistCircumference       │
│ hipCircumference         │
│ waistHipRatio (auto)     │
│ ... 11 más campos        │
└──────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        REQUEST LIFECYCLE
        
1. INCOMING REQUEST
   └─► GET /api/patients
       Header: Authorization: Bearer JWT_TOKEN

2. FILTER CHAIN
   └─► JwtAuthenticationFilter
       ├─ Extrae token del header
       ├─ Valida firma JWT
       ├─ Extrae email del token
       └─ Carga usuario de BD

3. SPRING SECURITY
   └─ Verifica autenticación
       ├─ ¿Token válido? ✅
       └─ ¿Usuario existe? ✅

4. AUTHORIZATION
   └─ Verifica autorización
       ├─ @PreAuthorize("hasAnyRole(...)")
       ├─ ¿Tiene rol correcto? ✅
       └─ ¿Acceso permitido? ✅

5. CONTROLLER
   └─► PatientController.getAllPatients()
       └─ Ejecuta método

6. SERVICE
   └─► PatientService.getAllPatients()
       └─ Lógica de negocio

7. REPOSITORY
   └─► PatientRepository.findAll()
       └─ SELECT * FROM patients

8. DATABASE
   └─► PostgreSQL
       └─ Retorna resultados

9. RESPONSE
   └─► JSON Array
       └─ [Patient1, Patient2, ...]
       └─ Status: 200 OK

10. CLIENT
    └─► React
        └─ Actualiza UI

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        ARCHIVOS POR TIPO
        
DOCUMENTACIÓN (10 archivos)
  ├─ INDEX.md (este mapa)
  ├─ EXECUTIVE_SUMMARY.md
  ├─ QUICK_START.md
  ├─ WINDOWS_SETUP.md
  ├─ README.md
  ├─ PROJECT_STRUCTURE.md
  ├─ API_REFERENCE.md
  ├─ INTEGRATION_GUIDE.md
  ├─ DELIVERY_SUMMARY.md
  └─ DELIVERY_CONTENTS.md

CONFIGURACIÓN (3 archivos)
  ├─ pom.xml
  ├─ run.bat
  └─ run.sh

CÓDIGO JAVA (24 archivos)
  ├─ NutricionBackendApplication.java
  ├─ entity/ (5)
  ├─ repository/ (5)
  ├─ service/ (2)
  ├─ controller/ (2)
  ├─ dto/ (6)
  ├─ config/ (2)
  └─ security/ (2)

RECURSOS (1 archivo)
  └─ application.yml

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        TECNOLOGÍAS
        
┌──────────────────────────────────┐
│ Framework: Spring Boot 3.2.0      │
│ ORM: Hibernate/JPA                │
│ BD: PostgreSQL 12+                │
│ Auth: Spring Security + JWT       │
│ Build: Maven 3.6+                 │
│ Java: 17 LTS                      │
│ API: REST + OpenAPI/Swagger       │
└──────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        PASOS PARA EMPEZAR
        
1️⃣  Instala requisitos (Java, Maven, PostgreSQL)
2️⃣  Crea BD: psql -U postgres -c "CREATE DATABASE nutricion_db;"
3️⃣  Ejecuta: mvn spring-boot:run
4️⃣  Espera: "Started NutricionBackendApplication"
5️⃣  Abre: http://localhost:8080/swagger-ui.html
6️⃣  Login: kevin.sarango@unl.edu.ec / admin123
7️⃣  Copia token
8️⃣  Haz clic "Authorize" en Swagger
9️⃣  Prueba endpoints
🔟 Integra con React (ver INTEGRATION_GUIDE.md)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        DOCUMENTOS RECOMENDADOS
        
Para empezar rápido:
  → EXECUTIVE_SUMMARY.md (5 min)
  → QUICK_START.md (5 min)

Para Windows específico:
  → WINDOWS_SETUP.md (15 min)

Para referencia:
  → API_REFERENCE.md (consulta)
  → PROJECT_STRUCTURE.md (consulta)

Para integración:
  → INTEGRATION_GUIDE.md (20 min)

Para documentación completa:
  → README.md (30 min)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        CONTACTO Y SOPORTE
        
Si hay problemas:
  1. Verifica: java -version (17+)
  2. Verifica: mvn -version (3.6+)
  3. Verifica: PostgreSQL corriendo
  4. Lee: WINDOWS_SETUP.md
  5. Revisa logs en terminal

Si funciona:
  ✅ Backend listo
  ✅ Swagger UI disponible
  ✅ Base de datos conexionada
  ✅ JWT authentication funcional
  ✅ Endpoints probados

        ¡LISTO PARA USAR! 🎉

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 TU CHECKLIST

- [ ] Leí este mapa
- [ ] Descargué requisitos (Java, Maven, PostgreSQL)
- [ ] Creé la base de datos
- [ ] Ejecuté `mvn spring-boot:run`
- [ ] Abrí Swagger UI
- [ ] Hice login
- [ ] Probé crear un paciente
- [ ] Leí INTEGRATION_GUIDE.md
- [ ] Conecté con React

---

**Creado:** Diciembre 11, 2024  
**Versión:** 1.0.0  
**Estado:** ✅ Listo para usar
