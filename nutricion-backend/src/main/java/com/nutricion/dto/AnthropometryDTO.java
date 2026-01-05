package com.nutricion.dto;

import java.time.LocalDate;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnthropometryDTO {
    private Long id;
    private Double weight;
    private Double height;
    private Double bmi;
    private Double waistCircumference;
    private Double hipCircumference;
    private Double waistHipRatio;
    private Double armCircumference;
    private Double thighCircumference;
    private Double tricepsSkinFold;
    private Double bicepsSkinFold;
    private Double subscapularSkinFold;
    private Double suprailiacSkinFold;
    private Double muscleMass;
    private Double boneMass;
    private Double waterPercentage;
    private Double fatPercentage;
    private LocalDate measuredDate;

    // Explicit getters
    public Long getId() { return id; }
    public Double getWeight() { return weight; }
    public Double getHeight() { return height; }
    public Double getBmi() { return bmi; }
    public Double getWaistCircumference() { return waistCircumference; }
    public Double getHipCircumference() { return hipCircumference; }
    public Double getWaistHipRatio() { return waistHipRatio; }
    public Double getArmCircumference() { return armCircumference; }
    public Double getThighCircumference() { return thighCircumference; }
    public Double getTricepsSkinFold() { return tricepsSkinFold; }
    public Double getBicepsSkinFold() { return bicepsSkinFold; }
    public Double getSubscapularSkinFold() { return subscapularSkinFold; }
    public Double getSuprailiacSkinFold() { return suprailiacSkinFold; }
    public Double getMuscleMass() { return muscleMass; }
    public Double getBoneMass() { return boneMass; }
    public Double getWaterPercentage() { return waterPercentage; }
    public Double getFatPercentage() { return fatPercentage; }
    public LocalDate getMeasuredDate() { return measuredDate; }

    // Explicit setters
    public void setId(Long id) { this.id = id; }
    public void setWeight(Double weight) { this.weight = weight; }
    public void setHeight(Double height) { this.height = height; }
    public void setBmi(Double bmi) { this.bmi = bmi; }
    public void setWaistCircumference(Double waistCircumference) { this.waistCircumference = waistCircumference; }
    public void setHipCircumference(Double hipCircumference) { this.hipCircumference = hipCircumference; }
    public void setWaistHipRatio(Double waistHipRatio) { this.waistHipRatio = waistHipRatio; }
    public void setArmCircumference(Double armCircumference) { this.armCircumference = armCircumference; }
    public void setThighCircumference(Double thighCircumference) { this.thighCircumference = thighCircumference; }
    public void setTricepsSkinFold(Double tricepsSkinFold) { this.tricepsSkinFold = tricepsSkinFold; }
    public void setBicepsSkinFold(Double bicepsSkinFold) { this.bicepsSkinFold = bicepsSkinFold; }
    public void setSubscapularSkinFold(Double subscapularSkinFold) { this.subscapularSkinFold = subscapularSkinFold; }
    public void setSuprailiacSkinFold(Double suprailiacSkinFold) { this.suprailiacSkinFold = suprailiacSkinFold; }
    public void setMuscleMass(Double muscleMass) { this.muscleMass = muscleMass; }
    public void setBoneMass(Double boneMass) { this.boneMass = boneMass; }
    public void setWaterPercentage(Double waterPercentage) { this.waterPercentage = waterPercentage; }
    public void setFatPercentage(Double fatPercentage) { this.fatPercentage = fatPercentage; }
    public void setMeasuredDate(LocalDate measuredDate) { this.measuredDate = measuredDate; }

    public static AnthropometryDTOBuilder builder() {
        return new AnthropometryDTOBuilder();
    }

    public static class AnthropometryDTOBuilder {
        private Long id;
        private Double weight;
        private Double height;
        private Double bmi;
        private Double waistCircumference;
        private Double hipCircumference;
        private Double waistHipRatio;
        private Double armCircumference;
        private Double thighCircumference;
        private Double tricepsSkinFold;
        private Double bicepsSkinFold;
        private Double subscapularSkinFold;
        private Double suprailiacSkinFold;
        private Double muscleMass;
        private Double boneMass;
        private Double waterPercentage;
        private Double fatPercentage;
        private LocalDate measuredDate;

        public AnthropometryDTOBuilder id(Long id) { this.id = id; return this; }
        public AnthropometryDTOBuilder weight(Double weight) { this.weight = weight; return this; }
        public AnthropometryDTOBuilder height(Double height) { this.height = height; return this; }
        public AnthropometryDTOBuilder bmi(Double bmi) { this.bmi = bmi; return this; }
        public AnthropometryDTOBuilder waistCircumference(Double waistCircumference) { this.waistCircumference = waistCircumference; return this; }
        public AnthropometryDTOBuilder hipCircumference(Double hipCircumference) { this.hipCircumference = hipCircumference; return this; }
        public AnthropometryDTOBuilder waistHipRatio(Double waistHipRatio) { this.waistHipRatio = waistHipRatio; return this; }
        public AnthropometryDTOBuilder armCircumference(Double armCircumference) { this.armCircumference = armCircumference; return this; }
        public AnthropometryDTOBuilder thighCircumference(Double thighCircumference) { this.thighCircumference = thighCircumference; return this; }
        public AnthropometryDTOBuilder tricepsSkinFold(Double tricepsSkinFold) { this.tricepsSkinFold = tricepsSkinFold; return this; }
        public AnthropometryDTOBuilder bicepsSkinFold(Double bicepsSkinFold) { this.bicepsSkinFold = bicepsSkinFold; return this; }
        public AnthropometryDTOBuilder subscapularSkinFold(Double subscapularSkinFold) { this.subscapularSkinFold = subscapularSkinFold; return this; }
        public AnthropometryDTOBuilder suprailiacSkinFold(Double suprailiacSkinFold) { this.suprailiacSkinFold = suprailiacSkinFold; return this; }
        public AnthropometryDTOBuilder muscleMass(Double muscleMass) { this.muscleMass = muscleMass; return this; }
        public AnthropometryDTOBuilder boneMass(Double boneMass) { this.boneMass = boneMass; return this; }
        public AnthropometryDTOBuilder waterPercentage(Double waterPercentage) { this.waterPercentage = waterPercentage; return this; }
        public AnthropometryDTOBuilder fatPercentage(Double fatPercentage) { this.fatPercentage = fatPercentage; return this; }
        public AnthropometryDTOBuilder measuredDate(LocalDate measuredDate) { this.measuredDate = measuredDate; return this; }

        public AnthropometryDTO build() {
            AnthropometryDTO dto = new AnthropometryDTO();
            dto.id = this.id;
            dto.weight = this.weight;
            dto.height = this.height;
            dto.bmi = this.bmi;
            dto.waistCircumference = this.waistCircumference;
            dto.hipCircumference = this.hipCircumference;
            dto.waistHipRatio = this.waistHipRatio;
            dto.armCircumference = this.armCircumference;
            dto.thighCircumference = this.thighCircumference;
            dto.tricepsSkinFold = this.tricepsSkinFold;
            dto.bicepsSkinFold = this.bicepsSkinFold;
            dto.subscapularSkinFold = this.subscapularSkinFold;
            dto.suprailiacSkinFold = this.suprailiacSkinFold;
            dto.muscleMass = this.muscleMass;
            dto.boneMass = this.boneMass;
            dto.waterPercentage = this.waterPercentage;
            dto.fatPercentage = this.fatPercentage;
            dto.measuredDate = this.measuredDate;
            return dto;
        }
    }
}

