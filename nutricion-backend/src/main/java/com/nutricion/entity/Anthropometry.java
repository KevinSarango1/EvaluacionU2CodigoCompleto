package com.nutricion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "anthropometry")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Anthropometry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic Measurements
    @Column
    private Double weight;

    @Column
    private Double height;

    @Column
    private Double bmi;

    // Circumferences
    @Column
    private Double waistCircumference;

    @Column
    private Double hipCircumference;

    @Column
    private Double waistHipRatio;

    @Column
    private Double armCircumference;

    @Column
    private Double thighCircumference;

    // Skin Folds
    @Column
    private Double tricepsSkinFold;

    @Column
    private Double bicepsSkinFold;

    @Column
    private Double subscapularSkinFold;

    @Column
    private Double suprailiacSkinFold;

    // Body Composition
    @Column
    private Double muscleMass;

    @Column
    private Double boneMass;

    @Column
    private Double waterPercentage;

    @Column
    private Double fatPercentage;

    @Column(name = "measured_date")
    private LocalDate measuredDate;

    // Calculate BMI if weight and height are provided
    public void calculateBMI() {
        if (weight != null && height != null && height > 0) {
            this.bmi = weight / (height * height);
        }
    }

    // Calculate WHR if waist and hip are provided
    public void calculateWHR() {
        if (waistCircumference != null && hipCircumference != null && hipCircumference > 0) {
            this.waistHipRatio = waistCircumference / hipCircumference;
        }
    }

    @PreUpdate
    @PrePersist
    public void calculateMetrics() {
        if (measuredDate == null) {
            measuredDate = LocalDate.now();
        }
        calculateBMI();
        calculateWHR();
    }

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
}

