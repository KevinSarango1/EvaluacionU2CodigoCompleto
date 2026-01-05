# Nutrición Backend - Spring Boot

Backend REST API para la aplicación de gestión de pacientes nutricionales.

## Requisitos Previos

- **Java 17+** instalado
- **Maven 3.6+** instalado
- **PostgreSQL 12+** instalado y ejecutándose

## Configuración de Base de Datos

### 1. Instalar PostgreSQL (si aún no lo has hecho)
- Descarga desde: https://www.postgresql.org/download/windows/
- Instala con la contraseña por defecto: `postgres`

### 2. Crear la base de datos
```sql
-- Abre pgAdmin o usa la línea de comandos
CREATE DATABASE nutricion_db;
```

O en terminal de PostgreSQL:
```bash
psql -U postgres
CREATE DATABASE nutricion_db;
\q
```

## Pasos para Ejecutar

### Opción 1: Usando Maven desde VS Code

1. **Abre la terminal integrada** en VS Code (Ctrl + `)

2. **Navega a la carpeta del backend**:
   ```bash
   cd nutricion-backend
   ```

3. **Compila y descarga las dependencias**:
   ```bash
   mvn clean install
   ```
   ⏳ *Esto puede tomar 2-3 minutos la primera vez*

4. **Ejecuta la aplicación**:
   ```bash
   mvn spring-boot:run
   ```

### Opción 2: Crear tarea en VS Code

1. Abre la Command Palette: `Ctrl + Shift + P`
2. Escribe: `Tasks: Create Task from Template`
3. Selecciona: `Maven`
4. Configura el comando: `spring-boot:run`

## Verificación

Cuando veas el mensaje:
```
Started NutricionBackendApplication in X.XXX seconds
```

El backend está listo. Accede a:

- **API Base**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/v3/api-docs

## Credenciales por Defecto

**Admin:**
- Email: `kevin.sarango@unl.edu.ec`
- Contraseña: `admin123`

## Endpoints Principales

### Autenticación
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "kevin.sarango@unl.edu.ec",
  "password": "admin123"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "email": "kevin.sarango@unl.edu.ec",
  "firstName": "Kevin",
  "lastName": "Sarango",
  "role": "ADMIN"
}
```

### Registrar Paciente
```bash
POST /api/patients
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "phone": "0999999999",
  "dateOfBirth": "1990-01-15",
  "gender": "M",
  "address": "Calle Principal 123",
  "occupation": "Ingeniero"
}
```

### Obtener Todos los Pacientes
```bash
GET /api/patients
Authorization: Bearer <TOKEN>
```

### Obtener Paciente por ID
```bash
GET /api/patients/{id}
Authorization: Bearer <TOKEN>
```

### Actualizar Historial Clínico
```bash
PUT /api/patients/{id}/history
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "medicalHistory": "Hipertensión",
  "surgicalHistory": "Apendicectomía",
  "familyHistory": "Diabetes",
  "complaint": "Sobrepeso",
  "dietaryHabits": "Sedentario",
  "physicalActivity": "Nulo",
  "nutritionalGoal": "Perder 10 kg"
}
```

### Actualizar Biometría
```bash
PUT /api/patients/{id}/biometrics
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "glucose": 110.5,
  "hemoglobinA1c": 6.2,
  "totalCholesterol": 200,
  "ldlCholesterol": 130,
  "hdlCholesterol": 45,
  "triglycerides": 150
}
```

### Actualizar Antropometría
```bash
PUT /api/patients/{id}/anthropometry
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "weight": 75.5,
  "height": 1.75,
  "waistCircumference": 90,
  "hipCircumference": 100,
  "armCircumference": 32
}
```

## Troubleshooting

### Error: Connection refused (PostgreSQL)
- Verifica que PostgreSQL esté ejecutándose
- En Windows: Abre Services y busca "PostgreSQL"
- Reinicia PostgreSQL si es necesario

### Error: Database 'nutricion_db' does not exist
- Ejecuta el comando SQL para crear la BD:
```bash
psql -U postgres -c "CREATE DATABASE nutricion_db;"
```

### Error: Maven not found
- Instala Maven desde: https://maven.apache.org/download.cgi
- Añade Maven al PATH de variables de entorno

### Puerto 8080 en uso
- Cambia el puerto en `application.yml`:
```yaml
server:
  port: 8081
```

### Limpiar antes de ejecutar
```bash
mvn clean install -U
mvn spring-boot:run
```

## Integración con Frontend React

En el archivo React (src/services/api.ts o similar), configura:

```typescript
const API_BASE_URL = 'http://localhost:8080/api';

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};
```

## Estructura del Proyecto

```
nutricion-backend/
├── src/
│   ├── main/
│   │   ├── java/com/nutricion/
│   │   │   ├── config/          # Configuraciones (Security, JWT)
│   │   │   ├── controller/      # REST Controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── entity/          # JPA Entities
│   │   │   ├── repository/      # Spring Data Repositories
│   │   │   ├── security/        # Seguridad (JWT, UserDetails)
│   │   │   ├── service/         # Lógica de negocio
│   │   │   └── NutricionBackendApplication.java  # Main class
│   │   └── resources/
│   │       └── application.yml   # Configuración
│   └── test/
├── pom.xml                       # Dependencias Maven
└── README.md
```

## Próximos Pasos

1. Integrar con el frontend React
2. Añadir validaciones más robustas
3. Implementar logs más detallados
4. Añadir paginación a endpoints de lista
5. Crear scripts de migración de base de datos con Flyway

## Soporte

Si tienes problemas, verifica:
1. Que PostgreSQL esté ejecutándose
2. Que Java 17+ esté instalado: `java -version`
3. Que Maven esté en el PATH: `mvn -version`
4. Los logs de la aplicación en la terminal
