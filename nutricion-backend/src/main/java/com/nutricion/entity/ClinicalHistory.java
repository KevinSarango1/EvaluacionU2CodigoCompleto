package com.nutricion.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "clinical_histories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicalHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Antecedents Section
    @Column(columnDefinition = "TEXT")
    private String medicalHistory;

    @Column(columnDefinition = "TEXT")
    private String surgicalHistory;

    @Column(columnDefinition = "TEXT")
    private String familyHistory;

    @Column(columnDefinition = "TEXT")
    private String pastDiseases;

    // Complaint Section
    @Column(columnDefinition = "TEXT")
    private String complaint;

    // Habits Section
    @Column(columnDefinition = "TEXT")
    private String dietaryHabits;

    @Column
    private String physicalActivity;

    @Column
    private String alcoholConsumption;

    @Column
    private String tobaccoUse;

    // Medications and Allergies Section
    @Column(columnDefinition = "TEXT")
    private String currentMedications;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(columnDefinition = "TEXT")
    private String foodIntolerances;

    // Objective Section
    @Column(columnDefinition = "TEXT")
    private String nutritionalGoal;

    @Column(columnDefinition = "TEXT")
    private String dietaryRestrictions;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // Explicit getters
    public Long getId() { return id; }
    public String getMedicalHistory() { return medicalHistory; }
    public String getSurgicalHistory() { return surgicalHistory; }
    public String getFamilyHistory() { return familyHistory; }
    public String getPastDiseases() { return pastDiseases; }
    public String getComplaint() { return complaint; }
    public String getDietaryHabits() { return dietaryHabits; }
    public String getPhysicalActivity() { return physicalActivity; }
    public String getAlcoholConsumption() { return alcoholConsumption; }
    public String getTobaccoUse() { return tobaccoUse; }
    public String getCurrentMedications() { return currentMedications; }
    public String getAllergies() { return allergies; }
    public String getFoodIntolerances() { return foodIntolerances; }
    public String getNutritionalGoal() { return nutritionalGoal; }
    public String getDietaryRestrictions() { return dietaryRestrictions; }
    public String getNotes() { return notes; }

    // Explicit setters
    public void setId(Long id) { this.id = id; }
    public void setMedicalHistory(String medicalHistory) { this.medicalHistory = medicalHistory; }
    public void setSurgicalHistory(String surgicalHistory) { this.surgicalHistory = surgicalHistory; }
    public void setFamilyHistory(String familyHistory) { this.familyHistory = familyHistory; }
    public void setPastDiseases(String pastDiseases) { this.pastDiseases = pastDiseases; }
    public void setComplaint(String complaint) { this.complaint = complaint; }
    public void setDietaryHabits(String dietaryHabits) { this.dietaryHabits = dietaryHabits; }
    public void setPhysicalActivity(String physicalActivity) { this.physicalActivity = physicalActivity; }
    public void setAlcoholConsumption(String alcoholConsumption) { this.alcoholConsumption = alcoholConsumption; }
    public void setTobaccoUse(String tobaccoUse) { this.tobaccoUse = tobaccoUse; }
    public void setCurrentMedications(String currentMedications) { this.currentMedications = currentMedications; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    public void setFoodIntolerances(String foodIntolerances) { this.foodIntolerances = foodIntolerances; }
    public void setNutritionalGoal(String nutritionalGoal) { this.nutritionalGoal = nutritionalGoal; }
    public void setDietaryRestrictions(String dietaryRestrictions) { this.dietaryRestrictions = dietaryRestrictions; }
    public void setNotes(String notes) { this.notes = notes; }
}
