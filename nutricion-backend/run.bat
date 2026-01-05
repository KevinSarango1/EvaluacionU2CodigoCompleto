@echo off
REM Script para ejecutar el backend de Nutrición en Windows

echo ========================================
echo Nutricion Backend - Iniciando...
echo ========================================

REM Verificar si Maven está instalado
mvn -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Maven no está instalado o no está en el PATH
    echo Descárgalo desde: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

REM Verificar si Java está instalado
java -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Java no está instalado o no está en el PATH
    echo Descárgalo desde: https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)

echo.
echo Compilando proyecto...
call mvn clean install
if errorlevel 1 (
    echo ERROR durante la compilación
    pause
    exit /b 1
)

echo.
echo ========================================
echo Iniciando Spring Boot (Puerto 8080)
echo ========================================
echo.

call mvn spring-boot:run

pause
