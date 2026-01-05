# 🪟 Guía para Windows - Backend Nutrición

## 📋 Instalaciones Requeridas

### 1. Java 17 (si no lo tienes)

1. Descarga desde: https://www.oracle.com/java/technologies/downloads/
2. Selecciona: **Windows x64 Installer**
3. Ejecuta el instalador (siguiente, siguiente...)
4. Cierra completamente VS Code

### 2. Maven (si no lo tienes)

1. Descarga desde: https://maven.apache.org/download.cgi
2. Descarga: **Binary zip archive**
3. Extrae en: `C:\Maven\` (crea la carpeta si no existe)
4. Añade a Variables de Entorno:
   - Presiona: `Win + X` → Selecciona "Sistema"
   - Haz clic en "Configuración avanzada del sistema"
   - Botón "Variables de entorno"
   - En "Variables del sistema", haz clic "Nueva"
   - Nombre: `MAVEN_HOME`
   - Valor: `C:\Maven\apache-maven-3.9.5`
   - Haz clic OK
   - Busca `Path` en la lista, haz doble clic
   - Haz clic "Nuevo"
   - Escribe: `%MAVEN_HOME%\bin`
   - Haz clic OK en todo

5. Cierra todos los programas abiertos (incluye VS Code)

6. Abre CMD y verifica:
   ```cmd
   mvn -version
   ```
   Debería mostrarte: `Apache Maven 3.9.5` o similar

### 3. PostgreSQL (si no lo tienes)

1. Descarga: https://www.postgresql.org/download/windows/
2. Ejecuta el instalador
3. **Importante**: Cuando te pida contraseña, usa: `postgres`
4. Puerto por defecto: `5432`
5. Al final, **DESMARCA** el check de "Stack Builder"
6. Haz clic Finish

7. Verifica que PostgreSQL está corriendo:
   - Presiona: `Win + R`
   - Escribe: `services.msc`
   - Busca `PostgreSQL`
   - Si muestra círculo rojo, haz clic derecho → "Iniciar servicio"

---

## 🚀 EJECUTAR EL BACKEND

### Opción 1: Script Automático (Recomendado)

1. Abre la carpeta: `C:\Users\ASUS\Downloads\IMC\nutricion-backend`
2. Busca el archivo: `run.bat`
3. **Doble-clic** en `run.bat`
4. Se abrirá una ventana de comando
5. Espera a que termine de compilar (verás "BUILD SUCCESS")
6. Cuando veas "Started NutricionBackendApplication", ¡está listo!

### Opción 2: Desde VS Code (Terminal)

1. Abre VS Code
2. Abre la carpeta: `IMC\nutricion-backend`
3. Presiona: `Ctrl + ´` (backtick, tecla debajo de ESC)
4. En la terminal, escribe:
   ```bash
   mvn clean install && mvn spring-boot:run
   ```
5. Espera a que aparezca: `Started NutricionBackendApplication`

### Opción 3: Paso a Paso (Terminal)

```cmd
# 1. Abre CMD como administrador (Win + X, selecciona CMD)

# 2. Ve a la carpeta
cd C:\Users\ASUS\Downloads\IMC\nutricion-backend

# 3. Compila (toma 2-3 minutos la primera vez)
mvn clean install

# 4. Inicia el servidor
mvn spring-boot:run
```

---

## ✅ Verificar que Funciona

Cuando veas en la terminal:
```
2024-12-11 17:45:32.123 INFO 12345 --- [main] com.nutricion.NutricionBackendApplication : Started NutricionBackendApplication in 12.345 seconds
```

Abre el navegador:
```
http://localhost:8080/swagger-ui.html
```

Deberías ver una interfaz con todos los endpoints disponibles.

---

## 🔐 Primer Login

1. En Swagger UI, busca: **POST /api/auth/login**
2. Haz clic en "Try it out"
3. En el cuadro de texto, pega esto:
   ```json
   {
     "email": "kevin.sarango@unl.edu.ec",
     "password": "admin123"
   }
   ```
4. Haz clic en "Execute"
5. Verás un token en la respuesta (algo como: `eyJhbGciOiJIUzUx...`)
6. **COPIA ese token** completo

7. En Swagger UI, arriba a la derecha, haz clic en botón **"Authorize"**
8. En el modal que se abre, pega esto:
   ```
   Bearer eyJhbGciOiJIUzUx...
   ```
   (Reemplaza con tu token)
9. Haz clic "Authorize" dentro del modal
10. Haz clic "Close"

Ahora puedes probar cualquier endpoint.

---

## ⚡ Crear un Paciente (Ejemplo)

1. En Swagger UI, busca: **POST /api/patients**
2. Haz clic en "Try it out"
3. En el cuadro de Request body, pega esto:
   ```json
   {
     "firstName": "Juan",
     "lastName": "García",
     "email": "juan@example.com",
     "phone": "0999888777",
     "dateOfBirth": "1990-05-15",
     "gender": "M",
     "address": "Calle Principal 123",
     "occupation": "Ingeniero"
   }
   ```
4. Haz clic en "Execute"
5. Verás una respuesta con los datos del paciente creado (incluirá un ID)

---

## 📱 Parar el Servidor

En la terminal donde está corriendo Spring Boot:
1. Presiona: `Ctrl + C`
2. Preguntará si quieres terminar - escribe: `Y` y presiona Enter

El servidor se detendrá.

---

## 🐛 Problemas Comunes en Windows

### ❌ Error: "mvn not found"
**Solución:**
- Maven no está en el PATH
- Reinstala y añade variables de entorno (paso 2 arriba)
- Cierra VS Code completamente
- Abre una terminal nueva

### ❌ Error: "Connection refused" (PostgreSQL)
**Solución:**
- PostgreSQL no está corriendo
- Abre Services (`Win + R`, escribe `services.msc`)
- Busca `PostgreSQL`
- Si está rojo, haz clic derecho → "Iniciar servicio"

### ❌ Error: "Database 'nutricion_db' does not exist"
**Solución:**
- Abre CMD y escribe:
  ```cmd
  psql -U postgres -c "CREATE DATABASE nutricion_db;"
  ```
- Presiona Enter
- Escribe contraseña: `postgres`

### ❌ Error: "Port 8080 already in use"
**Solución:**
1. Abre CMD como admin
2. Escribe: `netstat -ano | findstr :8080`
3. Anota el número del PID (último número)
4. Escribe: `taskkill /PID <número> /F`
5. Reintenta ejecutar

### ❌ Error: "BUILD FAILURE"
**Solución:**
1. Asegúrate que Java está instalado: `java -version`
2. Asegúrate que PostgreSQL está corriendo
3. Intenta: `mvn clean install -U`
4. Si sigue fallando, verifica los logs en la consola

---

## 🔄 Workflow Diario

```
CADA VEZ QUE QUIERAS USAR EL BACKEND:

1. Abre CMD (Win + X)

2. cd C:\Users\ASUS\Downloads\IMC\nutricion-backend

3. mvn spring-boot:run

4. Espera hasta: "Started NutricionBackendApplication"

5. Abre navegador: http://localhost:8080/swagger-ui.html

6. ¡Listo para usar!

7. Para parar: Ctrl + C en la terminal
```

---

## 💻 Usando PowerShell (Alternativa)

Si prefieres usar PowerShell en VS Code:

```powershell
# Navega a la carpeta
Set-Location "C:\Users\ASUS\Downloads\IMC\nutricion-backend"

# Ejecuta el backend
mvn clean install -DskipTests
mvn spring-boot:run
```

---

## 📝 Logs Útiles

Cuando estés ejecutando, verás cosas como:

```
2024-12-11 17:45:32.123 INFO  ... : Initializing Spring Boot application
2024-12-11 17:45:33.456 INFO  ... : Creating database tables
2024-12-11 17:45:34.789 INFO  ... : Initializing default admin user
2024-12-11 17:45:35.012 INFO  ... : Starting Tomcat v10.1.25
2024-12-11 17:45:35.234 INFO  ... : Started NutricionBackendApplication
```

Cuando veas "Started", significa que está listo para recibir requests.

---

## 🌐 URLs Importantes

| URL | Descripción |
|-----|-------------|
| http://localhost:8080 | Base API |
| http://localhost:8080/swagger-ui.html | Documentación interactiva |
| http://localhost:8080/v3/api-docs | Documentación JSON |

---

## 🎯 Próximo Paso

Una vez que el backend esté corriendo, la próxima acción es integrar con el React frontend.

Ver el archivo: `INTEGRATION_GUIDE.md`

---

## 📞 Troubleshooting Final

Si nada funciona:

1. **Verifica Java**: `java -version` (debe ser 17+)
2. **Verifica Maven**: `mvn -version`
3. **Verifica PostgreSQL**: Búscalo en Services
4. **Crea la BD**: `psql -U postgres -c "CREATE DATABASE nutricion_db;"`
5. **Limpia Maven**: `mvn clean`
6. **Intenta de nuevo**: `mvn spring-boot:run`

Si sigue sin funcionar, copia toda la salida de error en la terminal y búscalo en Google - 99% de los problemas tienen solución documentada.

---

**¡Buena suerte! 🚀**
