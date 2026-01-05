package com.nutricion.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private String email;
    private String firstName;
    private String lastName;
    private String role;

    // Explicit getters
    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getRole() { return role; }

    // Explicit setters
    public void setToken(String token) { this.token = token; }
    public void setEmail(String email) { this.email = email; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setRole(String role) { this.role = role; }

    // Explicit builder method
    public static LoginResponseBuilder builder() {
        return new LoginResponseBuilder();
    }

    public static class LoginResponseBuilder {
        private String token;
        private String email;
        private String firstName;
        private String lastName;
        private String role;

        public LoginResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public LoginResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public LoginResponseBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public LoginResponseBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public LoginResponseBuilder role(String role) {
            this.role = role;
            return this;
        }

        public LoginResponse build() {
            LoginResponse resp = new LoginResponse();
            resp.token = this.token;
            resp.email = this.email;
            resp.firstName = this.firstName;
            resp.lastName = this.lastName;
            resp.role = this.role;
            return resp;
        }
    }
}
