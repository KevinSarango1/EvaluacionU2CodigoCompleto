# 🚀 Inicio Rápido

## 📋 Requisitos

- ✅ Java 17+ (verificar: `java -version`)
- ✅ Node.js 18+ (verificar: `node -v`)
- ✅ Maven 3.6+ (verificar: `mvn -version`)

---

## ⚡ Setup en 5 Minutos

### 1. Backend (Spring Boot)

```bash
cd C:\Users\ASUS\Downloads\IMC\nutricion-backend
mvn spring-boot:run
```

✅ Espera a ver: `Started NutricionBackendApplication`

### 2. Frontend (React + Vite)

En **otra terminal**:
```bash
cd C:\Users\ASUS\Downloads\IMC
npm install
npm run dev
```

✅ Abre: http://localhost:5173

---

## 🔑 Credenciales

### Nutricionista
```
Email: kevin.sarango@unl.edu.ec
Password: admin123
```

### Admin
```
Email: admin@nutricion.com
Password: admin123
```

---

## 🎯 Primeros Pasos

### 1. Login
```
Email: kevin.sarango@unl.edu.ec
Password: admin123
```

### 2. Registrar Paciente
```
→ Click "Registrar Nuevo Paciente"
→ Llenar formulario
→ Guardar
```

### 3. Agregar Historial
```
→ Click en paciente
→ "Agregar Historial Clínico"
→ Llenar datos
→ Guardar
```

### 4. Ver Datos
```
→ Dashboard muestra pacientes
→ Click para detalles
```

---

## 📦 Puertos

- **Backend**: http://localhost:8080
- **Frontend**: http://localhost:5173
- **H2 Console**: http://localhost:8080/h2-console

---

## 🐛 Problemas Comunes

### "Port 8080 already in use"
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### "Module not found"
```bash
npm install
mvn clean install
```

### "Can't connect to backend"
- Verificar que backend esté corriendo en puerto 8080
- Revisar CORS en SecurityConfig.java

---

## ✅ Checklist

- [ ] Backend compilado (`mvn clean install`)
- [ ] Frontend dependencias instaladas (`npm install`)
- [ ] Backend ejecutándose (puerto 8080)
- [ ] Frontend ejecutándose (puerto 5173)
- [ ] Puedo hacer login
- [ ] Puedo registrar paciente

---

**¡Listo!** 🎉
