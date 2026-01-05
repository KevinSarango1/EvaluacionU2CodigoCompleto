package com.nutricion.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicalHistoryDTO {
    private Long id;
    private String medicalHistory;
    private String surgicalHistory;
    private String familyHistory;
    private String pastDiseases;
    private String complaint;
    private String dietaryHabits;
    private String physicalActivity;
    private String alcoholConsumption;
    private String tobaccoUse;
    private String currentMedications;
    private String allergies;
    private String foodIntolerances;
    private String nutritionalGoal;
    private String dietaryRestrictions;
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

    public static ClinicalHistoryDTOBuilder builder() {
        return new ClinicalHistoryDTOBuilder();
    }

    public static class ClinicalHistoryDTOBuilder {
        private Long id;
        private String medicalHistory;
        private String surgicalHistory;
        private String familyHistory;
        private String pastDiseases;
        private String complaint;
        private String dietaryHabits;
        private String physicalActivity;
        private String alcoholConsumption;
        private String tobaccoUse;
        private String currentMedications;
        private String allergies;
        private String foodIntolerances;
        private String nutritionalGoal;
        private String dietaryRestrictions;
        private String notes;

        public ClinicalHistoryDTOBuilder id(Long id) { this.id = id; return this; }
        public ClinicalHistoryDTOBuilder medicalHistory(String medicalHistory) { this.medicalHistory = medicalHistory; return this; }
        public ClinicalHistoryDTOBuilder surgicalHistory(String surgicalHistory) { this.surgicalHistory = surgicalHistory; return this; }
        public ClinicalHistoryDTOBuilder familyHistory(String familyHistory) { this.familyHistory = familyHistory; return this; }
        public ClinicalHistoryDTOBuilder pastDiseases(String pastDiseases) { this.pastDiseases = pastDiseases; return this; }
        public ClinicalHistoryDTOBuilder complaint(String complaint) { this.complaint = complaint; return this; }
        public ClinicalHistoryDTOBuilder dietaryHabits(String dietaryHabits) { this.dietaryHabits = dietaryHabits; return this; }
        public ClinicalHistoryDTOBuilder physicalActivity(String physicalActivity) { this.physicalActivity = physicalActivity; return this; }
        public ClinicalHistoryDTOBuilder alcoholConsumption(String alcoholConsumption) { this.alcoholConsumption = alcoholConsumption; return this; }
        public ClinicalHistoryDTOBuilder tobaccoUse(String tobaccoUse) { this.tobaccoUse = tobaccoUse; return this; }
        public ClinicalHistoryDTOBuilder currentMedications(String currentMedications) { this.currentMedications = currentMedications; return this; }
        public ClinicalHistoryDTOBuilder allergies(String allergies) { this.allergies = allergies; return this; }
        public ClinicalHistoryDTOBuilder foodIntolerances(String foodIntolerances) { this.foodIntolerances = foodIntolerances; return this; }
        public ClinicalHistoryDTOBuilder nutritionalGoal(String nutritionalGoal) { this.nutritionalGoal = nutritionalGoal; return this; }
        public ClinicalHistoryDTOBuilder dietaryRestrictions(String dietaryRestrictions) { this.dietaryRestrictions = dietaryRestrictions; return this; }
        public ClinicalHistoryDTOBuilder notes(String notes) { this.notes = notes; return this; }

        public ClinicalHistoryDTO build() {
            ClinicalHistoryDTO dto = new ClinicalHistoryDTO();
            dto.id = this.id;
            dto.medicalHistory = this.medicalHistory;
            dto.surgicalHistory = this.surgicalHistory;
            dto.familyHistory = this.familyHistory;
            dto.pastDiseases = this.pastDiseases;
            dto.complaint = this.complaint;
            dto.dietaryHabits = this.dietaryHabits;
            dto.physicalActivity = this.physicalActivity;
            dto.alcoholConsumption = this.alcoholConsumption;
            dto.tobaccoUse = this.tobaccoUse;
            dto.currentMedications = this.currentMedications;
            dto.allergies = this.allergies;
            dto.foodIntolerances = this.foodIntolerances;
            dto.nutritionalGoal = this.nutritionalGoal;
            dto.dietaryRestrictions = this.dietaryRestrictions;
            dto.notes = this.notes;
            return dto;
        }
    }
}

