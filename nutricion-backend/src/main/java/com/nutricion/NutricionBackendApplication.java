package com.nutricion;

import com.nutricion.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class NutricionBackendApplication {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(NutricionBackendApplication.class, args);
        
        // Initialize default admin user
        AuthService authService = context.getBean(AuthService.class);
        authService.initializeDefaultAdmin();
    }
}
