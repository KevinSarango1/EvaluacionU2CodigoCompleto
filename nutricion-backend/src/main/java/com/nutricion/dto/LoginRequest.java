package com.nutricion.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {
    private String email;
    private String password;

    // Explicit getters
    public String getEmail() { return email; }
    public String getPassword() { return password; }

    // Explicit setters
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }

    // Explicit builder method
    public static LoginRequestBuilder builder() {
        return new LoginRequestBuilder();
    }

    public static class LoginRequestBuilder {
        private String email;
        private String password;

        public LoginRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public LoginRequestBuilder password(String password) {
            this.password = password;
            return this;
        }

        public LoginRequest build() {
            LoginRequest req = new LoginRequest();
            req.email = this.email;
            req.password = this.password;
            return req;
        }
    }
}
