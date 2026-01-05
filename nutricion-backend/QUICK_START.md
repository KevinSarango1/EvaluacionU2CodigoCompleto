# 🚀 GUÍA RÁPIDA - Ejecutar Backend Nutrición

## ⚡ En 3 Pasos (Windows)

### Paso 1: Abre Terminal en VS Code
```
Presiona: Ctrl + ´ (backtick)
```

### Paso 2: Navega a la carpeta
```bash
cd nutricion-backend
```

### Paso 3: Ejecuta (opción más fácil)
```bash
mvn clean install && mvn spring-boot:run
```

✅ **¡Listo!** El backend estará en: http://localhost:8080

---

## 🔍 Verificar que Funciona

1. Abre en el navegador:
   ```
   http://localhost:8080/swagger-ui.html
   ```

2. Deberías ver la interfaz Swagger UI con todos los endpoints

---

## 🔐 Autenticarse

1. En Swagger UI, busca el endpoint: **POST /api/auth/login**

2. Expande el endpoint y haz clic en "Try it out"

3. Ingresa esto en el body:
   ```json
   {
     "email": "kevin.sarango@unl.edu.ec",
     "password": "admin123"
   }
   ```

4. Haz clic en "Execute"

5. Copia el `token` de la respuesta

6. En Swagger UI, haz clic en el botón "Authorize" (arriba a la derecha)

7. Pega: `Bearer <tu_token_aquí>`

---

## 🗄️ Requisito Previo: PostgreSQL

### Verificar si PostgreSQL está corriendo
En Windows, abre Services (Servicios):
- Presiona: `Win + R`
- Escribe: `services.msc`
- Busca "PostgreSQL"
- Si está en rojo, reinícialo

### O desde terminal:
```powershell
# Verifica conexión
psql -U postgres -c "SELECT 1"
```

### Crear base de datos (si no existe):
```powershell
psql -U postgres -c "CREATE DATABASE nutricion_db;"
```

---

## 🛑 Si algo Falla

### Error: "mvn" no se reconoce
```bash
# Instala Maven desde aquí:
# https://maven.apache.org/download.cgi
# Luego añade a variables de entorno Windows
```

### Error: "Database does not exist"
```bash
psql -U postgres -c "CREATE DATABASE nutricion_db;"
```

### Error: "Port 8080 is already in use"
```bash
# Cambia en application.yml
server:
  port: 8081
```

### Ver logs detallados
```bash
# Busca "Started NutricionBackendApplication"
# Cuando veas ese mensaje, ¡está listo!
```

---

## 📚 Probar Endpoints Principales

### 1. Crear Paciente
```bash
POST http://localhost:8080/api/patients
Authorization: Bearer <TOKEN>
Content-Type: application/json

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

### 2. Listar Pacientes
```bash
GET http://localhost:8080/api/patients
Authorization: Bearer <TOKEN>
```

### 3. Actualizar Historial Clínico
```bash
PUT http://localhost:8080/api/patients/{id}/history
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "medicalHistory": "Hipertensión diagnosticada hace 5 años",
  "surgicalHistory": "Apendicectomía en 2010",
  "familyHistory": "Padre diabético",
  "complaint": "Quiero bajar de peso",
  "dietaryHabits": "Come mucho pan y azúcares",
  "physicalActivity": "Sedentario",
  "nutritionalGoal": "Alcanzar BMI de 25"
}
```

---

## 🔗 Enlaces Útiles

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs JSON**: http://localhost:8080/v3/api-docs
- **Documentación Spring Boot**: https://spring.io/projects/spring-boot

---

## 💡 Consejos

1. **Mantén abierto Swagger UI** mientras desarrollas para probar endpoints
2. **Copia siempre el token** después de login
3. **Usa Postman** (https://www.postman.com/) para requests más complejos
4. **Verifica logs** en la terminal para entender errores

---

¿Problemas? Verifica en este orden:
1. ✅ PostgreSQL está ejecutándose
2. ✅ Java 17+ instalado (`java -version`)
3. ✅ Maven en PATH (`mvn -version`)
4. ✅ Logs en la terminal del VS Code
