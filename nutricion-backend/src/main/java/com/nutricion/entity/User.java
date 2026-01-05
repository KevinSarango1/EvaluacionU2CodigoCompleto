package com.nutricion.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String role; // ADMIN, NUTRITIONIST

    @Column(nullable = false)
    private Boolean active = true;

    // Explicit getters (for when Lombok annotation processing fails)
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getRole() { return role; }
    public Boolean getActive() { return active; }

    // Explicit setters
    public void setId(Long id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setRole(String role) { this.role = role; }
    public void setActive(Boolean active) { this.active = active; }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String email;
        private String password;
        private String firstName;
        private String lastName;
        private String role;
        private Boolean active = true;

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        public UserBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        public UserBuilder role(String role) { this.role = role; return this; }
        public UserBuilder active(Boolean active) { this.active = active; return this; }

        public User build() {
            User user = new User();
            user.id = this.id;
            user.email = this.email;
            user.password = this.password;
            user.firstName = this.firstName;
            user.lastName = this.lastName;
            user.role = this.role;
            user.active = this.active;
            return user;
        }
    }
}

