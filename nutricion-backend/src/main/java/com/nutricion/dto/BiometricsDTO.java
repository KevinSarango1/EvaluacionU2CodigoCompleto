package com.nutricion.dto;

import java.time.LocalDate;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiometricsDTO {
    private Long id;
    private Double glucose;
    private Double hemoglobinA1c;
    private Double totalCholesterol;
    private Double ldlCholesterol;
    private Double hdlCholesterol;
    private Double triglycerides;
    private Double vldlCholesterol;
    private Double ast;
    private Double alt;
    private Double ggt;
    private Double bilirubin;
    private Double creatinine;
    private Double bun;
    private Double totalProteins;
    private Double albumin;
    private Double prealbumin;
    private Double hemoglobin;
    private Double hematocrit;
    private Double whiteBloodCells;
    private Double platelets;
    private Double vitaminB12;
    private Double folacin;
    private Double iron;
    private Double ferritin;
    private Double zinc;
    private Double calcium;
    private Double magnesium;
    private Double phosphorus;
    private LocalDate measuredDate;

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

    public static BiometricsDTOBuilder builder() {
        return new BiometricsDTOBuilder();
    }

    public static class BiometricsDTOBuilder {
        private Long id;
        private Double glucose;
        private Double hemoglobinA1c;
        private Double totalCholesterol;
        private Double ldlCholesterol;
        private Double hdlCholesterol;
        private Double triglycerides;
        private Double vldlCholesterol;
        private Double ast;
        private Double alt;
        private Double ggt;
        private Double bilirubin;
        private Double creatinine;
        private Double bun;
        private Double totalProteins;
        private Double albumin;
        private Double prealbumin;
        private Double hemoglobin;
        private Double hematocrit;
        private Double whiteBloodCells;
        private Double platelets;
        private Double vitaminB12;
        private Double folacin;
        private Double iron;
        private Double ferritin;
        private Double zinc;
        private Double calcium;
        private Double magnesium;
        private Double phosphorus;
        private LocalDate measuredDate;

        public BiometricsDTOBuilder id(Long id) { this.id = id; return this; }
        public BiometricsDTOBuilder glucose(Double glucose) { this.glucose = glucose; return this; }
        public BiometricsDTOBuilder hemoglobinA1c(Double hemoglobinA1c) { this.hemoglobinA1c = hemoglobinA1c; return this; }
        public BiometricsDTOBuilder totalCholesterol(Double totalCholesterol) { this.totalCholesterol = totalCholesterol; return this; }
        public BiometricsDTOBuilder ldlCholesterol(Double ldlCholesterol) { this.ldlCholesterol = ldlCholesterol; return this; }
        public BiometricsDTOBuilder hdlCholesterol(Double hdlCholesterol) { this.hdlCholesterol = hdlCholesterol; return this; }
        public BiometricsDTOBuilder triglycerides(Double triglycerides) { this.triglycerides = triglycerides; return this; }
        public BiometricsDTOBuilder vldlCholesterol(Double vldlCholesterol) { this.vldlCholesterol = vldlCholesterol; return this; }
        public BiometricsDTOBuilder ast(Double ast) { this.ast = ast; return this; }
        public BiometricsDTOBuilder alt(Double alt) { this.alt = alt; return this; }
        public BiometricsDTOBuilder ggt(Double ggt) { this.ggt = ggt; return this; }
        public BiometricsDTOBuilder bilirubin(Double bilirubin) { this.bilirubin = bilirubin; return this; }
        public BiometricsDTOBuilder creatinine(Double creatinine) { this.creatinine = creatinine; return this; }
        public BiometricsDTOBuilder bun(Double bun) { this.bun = bun; return this; }
        public BiometricsDTOBuilder totalProteins(Double totalProteins) { this.totalProteins = totalProteins; return this; }
        public BiometricsDTOBuilder albumin(Double albumin) { this.albumin = albumin; return this; }
        public BiometricsDTOBuilder prealbumin(Double prealbumin) { this.prealbumin = prealbumin; return this; }
        public BiometricsDTOBuilder hemoglobin(Double hemoglobin) { this.hemoglobin = hemoglobin; return this; }
        public BiometricsDTOBuilder hematocrit(Double hematocrit) { this.hematocrit = hematocrit; return this; }
        public BiometricsDTOBuilder whiteBloodCells(Double whiteBloodCells) { this.whiteBloodCells = whiteBloodCells; return this; }
        public BiometricsDTOBuilder platelets(Double platelets) { this.platelets = platelets; return this; }
        public BiometricsDTOBuilder vitaminB12(Double vitaminB12) { this.vitaminB12 = vitaminB12; return this; }
        public BiometricsDTOBuilder folacin(Double folacin) { this.folacin = folacin; return this; }
        public BiometricsDTOBuilder iron(Double iron) { this.iron = iron; return this; }
        public BiometricsDTOBuilder ferritin(Double ferritin) { this.ferritin = ferritin; return this; }
        public BiometricsDTOBuilder zinc(Double zinc) { this.zinc = zinc; return this; }
        public BiometricsDTOBuilder calcium(Double calcium) { this.calcium = calcium; return this; }
        public BiometricsDTOBuilder magnesium(Double magnesium) { this.magnesium = magnesium; return this; }
        public BiometricsDTOBuilder phosphorus(Double phosphorus) { this.phosphorus = phosphorus; return this; }
        public BiometricsDTOBuilder measuredDate(LocalDate measuredDate) { this.measuredDate = measuredDate; return this; }

        public BiometricsDTO build() {
            BiometricsDTO dto = new BiometricsDTO();
            dto.id = this.id;
            dto.glucose = this.glucose;
            dto.hemoglobinA1c = this.hemoglobinA1c;
            dto.totalCholesterol = this.totalCholesterol;
            dto.ldlCholesterol = this.ldlCholesterol;
            dto.hdlCholesterol = this.hdlCholesterol;
            dto.triglycerides = this.triglycerides;
            dto.vldlCholesterol = this.vldlCholesterol;
            dto.ast = this.ast;
            dto.alt = this.alt;
            dto.ggt = this.ggt;
            dto.bilirubin = this.bilirubin;
            dto.creatinine = this.creatinine;
            dto.bun = this.bun;
            dto.totalProteins = this.totalProteins;
            dto.albumin = this.albumin;
            dto.prealbumin = this.prealbumin;
            dto.hemoglobin = this.hemoglobin;
            dto.hematocrit = this.hematocrit;
            dto.whiteBloodCells = this.whiteBloodCells;
            dto.platelets = this.platelets;
            dto.vitaminB12 = this.vitaminB12;
            dto.folacin = this.folacin;
            dto.iron = this.iron;
            dto.ferritin = this.ferritin;
            dto.zinc = this.zinc;
            dto.calcium = this.calcium;
            dto.magnesium = this.magnesium;
            dto.phosphorus = this.phosphorus;
            dto.measuredDate = this.measuredDate;
            return dto;
        }
    }
}

