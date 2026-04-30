package com.nutricion.service;

import com.nutricion.dto.LoginRequest;
import com.nutricion.dto.LoginResponse;
import com.nutricion.entity.User;
import com.nutricion.repository.UserRepository;
import com.nutricion.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                       AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    // Credenciales de admin leídas desde variables de entorno (nunca hardcodeadas)
    @org.springframework.beans.factory.annotation.Value("${app.admin.email}")
    private String defaultAdminEmail;

    @org.springframework.beans.factory.annotation.Value("${app.admin.password}")
    private String defaultAdminPassword;

    public void initializeDefaultAdmin() {
        if (userRepository.findByEmail(defaultAdminEmail).isEmpty()) {
            User adminUser = User.builder()
                    .email(defaultAdminEmail)
                    .password(passwordEncoder.encode(defaultAdminPassword))
                    .firstName("Admin")
                    .lastName("Sistema")
                    .role("ADMIN")
                    .active(true)
                    .build();
            userRepository.save(adminUser);
        }
    }

    public LoginResponse login(LoginRequest request) {
        // Toda autenticación pasa por BCrypt — no existe bypass en texto plano
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtTokenProvider.generateToken(user);
        return LoginResponse.builder()
                .token(token)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }

    public User createNutritionist(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("NUTRITIONIST");
        user.setActive(true);
        return userRepository.save(user);
    }

    public List<User> getAllNutritionists() {
        return userRepository.findByRole("NUTRITIONIST");
    }

    public User updateNutritionist(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setActive(userDetails.getActive());
        return userRepository.save(user);
    }

    public void deleteNutritionist(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        userRepository.deleteById(id);
    }
}
