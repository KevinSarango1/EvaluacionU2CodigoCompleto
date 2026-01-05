package com.nutricion.dto;

import java.time.LocalDate;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String occupation;
    private LocalDate createdAt;
    private ClinicalHistoryDTO clinicalHistory;
    private BiometricsDTO biometrics;
    private AnthropometryDTO anthropometry;

    // Explicit getters
    public Long getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public String getGender() { return gender; }
    public String getAddress() { return address; }
    public String getOccupation() { return occupation; }
    public LocalDate getCreatedAt() { return createdAt; }
    public ClinicalHistoryDTO getClinicalHistory() { return clinicalHistory; }
    public BiometricsDTO getBiometrics() { return biometrics; }
    public AnthropometryDTO getAnthropometry() { return anthropometry; }

    // Explicit setters
    public void setId(Long id) { this.id = id; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public void setGender(String gender) { this.gender = gender; }
    public void setAddress(String address) { this.address = address; }
    public void setOccupation(String occupation) { this.occupation = occupation; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
    public void setClinicalHistory(ClinicalHistoryDTO clinicalHistory) { this.clinicalHistory = clinicalHistory; }
    public void setBiometrics(BiometricsDTO biometrics) { this.biometrics = biometrics; }
    public void setAnthropometry(AnthropometryDTO anthropometry) { this.anthropometry = anthropometry; }

    // Explicit builder method
    public static PatientDTOBuilder builder() {
        return new PatientDTOBuilder();
    }

    public static class PatientDTOBuilder {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private LocalDate dateOfBirth;
        private String gender;
        private String address;
        private String occupation;
        private LocalDate createdAt;
        private ClinicalHistoryDTO clinicalHistory;
        private BiometricsDTO biometrics;
        private AnthropometryDTO anthropometry;

        public PatientDTOBuilder id(Long id) { this.id = id; return this; }
        public PatientDTOBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        public PatientDTOBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        public PatientDTOBuilder email(String email) { this.email = email; return this; }
        public PatientDTOBuilder phone(String phone) { this.phone = phone; return this; }
        public PatientDTOBuilder dateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public PatientDTOBuilder gender(String gender) { this.gender = gender; return this; }
        public PatientDTOBuilder address(String address) { this.address = address; return this; }
        public PatientDTOBuilder occupation(String occupation) { this.occupation = occupation; return this; }
        public PatientDTOBuilder createdAt(LocalDate createdAt) { this.createdAt = createdAt; return this; }
        public PatientDTOBuilder clinicalHistory(ClinicalHistoryDTO clinicalHistory) { this.clinicalHistory = clinicalHistory; return this; }
        public PatientDTOBuilder biometrics(BiometricsDTO biometrics) { this.biometrics = biometrics; return this; }
        public PatientDTOBuilder anthropometry(AnthropometryDTO anthropometry) { this.anthropometry = anthropometry; return this; }

        public PatientDTO build() {
            PatientDTO dto = new PatientDTO();
            dto.id = this.id;
            dto.firstName = this.firstName;
            dto.lastName = this.lastName;
            dto.email = this.email;
            dto.phone = this.phone;
            dto.dateOfBirth = this.dateOfBirth;
            dto.gender = this.gender;
            dto.address = this.address;
            dto.occupation = this.occupation;
            dto.createdAt = this.createdAt;
            dto.clinicalHistory = this.clinicalHistory;
            dto.biometrics = this.biometrics;
            dto.anthropometry = this.anthropometry;
            return dto;
        }
    }
}
