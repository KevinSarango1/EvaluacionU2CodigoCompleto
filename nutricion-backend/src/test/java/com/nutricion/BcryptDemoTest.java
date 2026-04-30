package com.nutricion;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Demostración criptográfica: salt aleatorio en BCrypt.
 *
 * Objetivo: mostrar que la misma contraseña produce hashes distintos
 * en cada llamada gracias al salt aleatorio de 128 bits que BCrypt
 * genera internamente (RFC 9106 / OWASP Password Storage Cheat Sheet).
 *
 * Ejecutar con:
 *   mvn test -Dtest=BcryptDemoTest -pl nutricion-backend
 */
public class BcryptDemoTest {

    @Test
    void demostrarSaltAleatorioYResistencia() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String password = "admin123";

        System.out.println("============================================================");
        System.out.println("  DEMOSTRACION CRIPTOGRAFICA - Salt Aleatorio en BCrypt-12  ");
        System.out.println("============================================================");
        System.out.println("Contrasena de prueba : " + password);
        System.out.println("Cost factor          : 12  (2^12 = 4096 iteraciones)");
        System.out.println("Entropia del salt    : 128 bits");
        System.out.println("------------------------------------------------------------");

        // --- Primera codificación ---
        long t1Start = System.currentTimeMillis();
        String hash1 = encoder.encode(password);
        long t1End = System.currentTimeMillis();

        // --- Segunda codificación (misma contraseña) ---
        long t2Start = System.currentTimeMillis();
        String hash2 = encoder.encode(password);
        long t2End = System.currentTimeMillis();

        System.out.println("\nHash #1 : " + hash1);
        System.out.println("Tiempo  : " + (t1End - t1Start) + " ms");

        System.out.println("\nHash #2 : " + hash2);
        System.out.println("Tiempo  : " + (t2End - t2Start) + " ms");

        // --- Análisis del salt embebido ---
        // Formato BCrypt: $2a$12$<22 chars salt><31 chars hash>
        String salt1 = hash1.substring(7, 29);   // posición del salt en el string
        String salt2 = hash2.substring(7, 29);

        System.out.println("\n------------------------------------------------------------");
        System.out.println("ANALISIS DEL SALT EMBEBIDO (primeros 22 chars base-64):");
        System.out.println("  Salt de Hash #1 : " + salt1);
        System.out.println("  Salt de Hash #2 : " + salt2);
        System.out.println("  Salts iguales?  : " + salt1.equals(salt2));
        System.out.println("  Hashes iguales? : " + hash1.equals(hash2));

        // --- Verificación de autenticidad ---
        boolean match1 = encoder.matches(password, hash1);
        boolean match2 = encoder.matches(password, hash2);

        System.out.println("\n------------------------------------------------------------");
        System.out.println("VERIFICACION DE AUTENTICIDAD (encoder.matches):");
        System.out.println("  password vs Hash #1 -> " + match1 + "  (autenticacion OK)");
        System.out.println("  password vs Hash #2 -> " + match2 + "  (autenticacion OK)");

        // --- Resistencia a Rainbow Tables ---
        System.out.println("\n------------------------------------------------------------");
        System.out.println("CONCLUSION:");
        System.out.println("  * Hashes distintos -> salt aleatorio de 128 bits confirmado.");
        System.out.println("  * Rainbow Tables inviables: espacio 2^128 entradas por salt.");
        System.out.println("  * Ambos hashes verifican correctamente la contrasena original.");
        System.out.println("  * Tiempo promedio de hash: ~" +
                           ((t1End - t1Start + t2End - t2Start) / 2) + " ms (cost=12).");
        System.out.println("============================================================\n");

        // Assertions para que el test pase formalmente
        assert !hash1.equals(hash2)   : "Los hashes NO deben ser iguales (salt distinto)";
        assert !salt1.equals(salt2)   : "Los salts NO deben ser iguales";
        assert match1                 : "Hash #1 debe verificar la contrasena";
        assert match2                 : "Hash #2 debe verificar la contrasena";
    }
}
