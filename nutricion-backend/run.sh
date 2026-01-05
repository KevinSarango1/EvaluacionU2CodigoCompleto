#!/bin/bash
# Script para ejecutar el backend de Nutrición en Linux/Mac

echo "========================================"
echo "Nutricion Backend - Iniciando..."
echo "========================================"

# Verificar si Maven está instalado
if ! command -v mvn &> /dev/null; then
    echo "ERROR: Maven no está instalado"
    echo "Instálalo desde: https://maven.apache.org/download.cgi"
    exit 1
fi

# Verificar si Java está instalado
if ! command -v java &> /dev/null; then
    echo "ERROR: Java no está instalado"
    echo "Instálalo desde: https://www.oracle.com/java/technologies/downloads/"
    exit 1
fi

echo ""
echo "Compilando proyecto..."
mvn clean install
if [ $? -ne 0 ]; then
    echo "ERROR durante la compilación"
    exit 1
fi

echo ""
echo "========================================"
echo "Iniciando Spring Boot (Puerto 8080)"
echo "========================================"
echo ""

mvn spring-boot:run
