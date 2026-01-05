package com.nutricion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String address;

    @Column
    private String occupation;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "clinical_history_id", referencedColumnName = "id")
    private ClinicalHistory clinicalHistory;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "biometrics_id", referencedColumnName = "id")
    private Biometrics biometrics;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "anthropometry_id", referencedColumnName = "id")
    private Anthropometry anthropometry;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDate createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
    }

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
    public ClinicalHistory getClinicalHistory() { return clinicalHistory; }
    public Biometrics getBiometrics() { return biometrics; }
    public Anthropometry getAnthropometry() { return anthropometry; }
    public LocalDate getCreatedAt() { return createdAt; }

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
    public void setClinicalHistory(ClinicalHistory clinicalHistory) { this.clinicalHistory = clinicalHistory; }
    public void setBiometrics(Biometrics biometrics) { this.biometrics = biometrics; }
    public void setAnthropometry(Anthropometry anthropometry) { this.anthropometry = anthropometry; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}

