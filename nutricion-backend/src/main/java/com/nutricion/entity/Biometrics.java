package com.nutricion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "biometrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Biometrics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Carbohydrate Metabolism
    @Column
    private Double glucose;

    @Column
    private Double hemoglobinA1c;

    // Lipid Profile
    @Column
    private Double totalCholesterol;

    @Column
    private Double ldlCholesterol;

    @Column
    private Double hdlCholesterol;

    @Column
    private Double triglycerides;

    @Column
    private Double vldlCholesterol;

    // Liver Function
    @Column
    private Double ast;

    @Column
    private Double alt;

    @Column
    private Double ggt;

    @Column
    private Double bilirubin;

    // Kidney Function
    @Column
    private Double creatinine;

    @Column
    private Double bun;

    // Proteins
    @Column
    private Double totalProteins;

    @Column
    private Double albumin;

    @Column
    private Double prealbumin;

    // Hemogram
    @Column
    private Double hemoglobin;

    @Column
    private Double hematocrit;

    @Column
    private Double whiteBloodCells;

    @Column
    private Double platelets;

    // Micronutrients
    @Column
    private Double vitaminB12;

    @Column
    private Double folacin;

    @Column
    private Double iron;

    @Column
    private Double ferritin;

    @Column
    private Double zinc;

    @Column
    private Double calcium;

    @Column
    private Double magnesium;

    @Column
    private Double phosphorus;

    @Column(name = "measured_date")
    private LocalDate measuredDate;

    @PrePersist
    protected void onCreate() {
        if (measuredDate == null) {
            measuredDate = LocalDate.now();
        }
    }

    // Explicit getters
    public Long getId() { return id; }
    public Double getGlucose() { return glucose; }
    public Double getHemoglobinA1c() { return hemoglobinA1c; }
    public Double getTotalCholesterol() { return totalCholesterol; }
    public Double getLdlCholesterol() { return ldlCholesterol; }
    public Double getHdlCholesterol() { return hdlCholesterol; }
    public Double getTriglycerides() { return triglycerides; }
    public Double getVldlCholesterol() { return vldlCholesterol; }
    public Double getAst() { return ast; }
    public Double getAlt() { return alt; }
    public Double getGgt() { return ggt; }
    public Double getBilirubin() { return bilirubin; }
    public Double getCreatinine() { return creatinine; }
    public Double getBun() { return bun; }
    public Double getTotalProteins() { return totalProteins; }
    public Double getAlbumin() { return albumin; }
    public Double getPrealbumin() { return prealbumin; }
    public Double getHemoglobin() { return hemoglobin; }
    public Double getHematocrit() { return hematocrit; }
    public Double getWhiteBloodCells() { return whiteBloodCells; }
    public Double getPlatelets() { return platelets; }
    public Double getVitaminB12() { return vitaminB12; }
    public Double getFolacin() { return folacin; }
    public Double getIron() { return iron; }
    public Double getFerritin() { return ferritin; }
    public Double getZinc() { return zinc; }
    public Double getCalcium() { return calcium; }
    public Double getMagnesium() { return magnesium; }
    public Double getPhosphorus() { return phosphorus; }
    public LocalDate getMeasuredDate() { return measuredDate; }

    // Explicit setters
    public void setId(Long id) { this.id = id; }
    public void setGlucose(Double glucose) { this.glucose = glucose; }
    public void setHemoglobinA1c(Double hemoglobinA1c) { this.hemoglobinA1c = hemoglobinA1c; }
    public void setTotalCholesterol(Double totalCholesterol) { this.totalCholesterol = totalCholesterol; }
    public void setLdlCholesterol(Double ldlCholesterol) { this.ldlCholesterol = ldlCholesterol; }
    public void setHdlCholesterol(Double hdlCholesterol) { this.hdlCholesterol = hdlCholesterol; }
    public void setTriglycerides(Double triglycerides) { this.triglycerides = triglycerides; }
    public void setVldlCholesterol(Double vldlCholesterol) { this.vldlCholesterol = vldlCholesterol; }
    public void setAst(Double ast) { this.ast = ast; }
    public void setAlt(Double alt) { this.alt = alt; }
    public void setGgt(Double ggt) { this.ggt = ggt; }
    public void setBilirubin(Double bilirubin) { this.bilirubin = bilirubin; }
    public void setCreatinine(Double creatinine) { this.creatinine = creatinine; }
    public void setBun(Double bun) { this.bun = bun; }
    public void setTotalProteins(Double totalProteins) { this.totalProteins = totalProteins; }
    public void setAlbumin(Double albumin) { this.albumin = albumin; }
    public void setPrealbumin(Double prealbumin) { this.prealbumin = prealbumin; }
    public void setHemoglobin(Double hemoglobin) { this.hemoglobin = hemoglobin; }
    public void setHematocrit(Double hematocrit) { this.hematocrit = hematocrit; }
    public void setWhiteBloodCells(Double whiteBloodCells) { this.whiteBloodCells = whiteBloodCells; }
    public void setPlatelets(Double platelets) { this.platelets = platelets; }
    public void setVitaminB12(Double vitaminB12) { this.vitaminB12 = vitaminB12; }
    public void setFolacin(Double folacin) { this.folacin = folacin; }
    public void setIron(Double iron) { this.iron = iron; }
    public void setFerritin(Double ferritin) { this.ferritin = ferritin; }
    public void setZinc(Double zinc) { this.zinc = zinc; }
    public void setCalcium(Double calcium) { this.calcium = calcium; }
    public void setMagnesium(Double magnesium) { this.magnesium = magnesium; }
    public void setPhosphorus(Double phosphorus) { this.phosphorus = phosphorus; }
    public void setMeasuredDate(LocalDate measuredDate) { this.measuredDate = measuredDate; }
}

