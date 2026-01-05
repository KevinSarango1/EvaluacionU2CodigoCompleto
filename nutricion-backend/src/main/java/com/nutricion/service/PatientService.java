package com.nutricion.service;

import com.nutricion.dto.PatientDTO;
import com.nutricion.dto.ClinicalHistoryDTO;
import com.nutricion.dto.BiometricsDTO;
import com.nutricion.dto.AnthropometryDTO;
import com.nutricion.entity.*;
import com.nutricion.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PatientService {
    private final PatientRepository patientRepository;
    private final ClinicalHistoryRepository clinicalHistoryRepository;
    private final BiometricsRepository biometricsRepository;
    private final AnthropometryRepository anthropometryRepository;

    public PatientService(PatientRepository patientRepository, 
                          ClinicalHistoryRepository clinicalHistoryRepository,
                          BiometricsRepository biometricsRepository,
                          AnthropometryRepository anthropometryRepository) {
        this.patientRepository = patientRepository;
        this.clinicalHistoryRepository = clinicalHistoryRepository;
        this.biometricsRepository = biometricsRepository;
        this.anthropometryRepository = anthropometryRepository;
    }

    public PatientDTO createPatient(PatientDTO patientDTO) {
        Patient patient = new Patient();
        patient.setFirstName(patientDTO.getFirstName());
        patient.setLastName(patientDTO.getLastName());
        patient.setEmail(patientDTO.getEmail());
        patient.setPhone(patientDTO.getPhone());
        patient.setDateOfBirth(patientDTO.getDateOfBirth());
        patient.setGender(patientDTO.getGender());
        patient.setAddress(patientDTO.getAddress());
        patient.setOccupation(patientDTO.getOccupation());

        // Create empty clinical history
        ClinicalHistory clinicalHistory = new ClinicalHistory();
        clinicalHistory = clinicalHistoryRepository.save(clinicalHistory);
        patient.setClinicalHistory(clinicalHistory);

        Patient savedPatient = patientRepository.save(patient);
        return convertToDTO(savedPatient);
    }

    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        return convertToDTO(patient);
    }

    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PatientDTO updatePatient(Long id, PatientDTO patientDTO) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        patient.setFirstName(patientDTO.getFirstName());
        patient.setLastName(patientDTO.getLastName());
        patient.setPhone(patientDTO.getPhone());
        patient.setDateOfBirth(patientDTO.getDateOfBirth());
        patient.setGender(patientDTO.getGender());
        patient.setAddress(patientDTO.getAddress());
        patient.setOccupation(patientDTO.getOccupation());

        Patient updatedPatient = patientRepository.save(patient);
        return convertToDTO(updatedPatient);
    }

    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new RuntimeException("Paciente no encontrado");
        }
        patientRepository.deleteById(id);
    }

    public PatientDTO updateClinicalHistory(Long patientId, ClinicalHistoryDTO historyDTO) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        ClinicalHistory history = patient.getClinicalHistory();
        if (history == null) {
            history = new ClinicalHistory();
        }

        // Update all fields
        history.setMedicalHistory(historyDTO.getMedicalHistory());
        history.setSurgicalHistory(historyDTO.getSurgicalHistory());
        history.setFamilyHistory(historyDTO.getFamilyHistory());
        history.setPastDiseases(historyDTO.getPastDiseases());
        history.setComplaint(historyDTO.getComplaint());
        history.setDietaryHabits(historyDTO.getDietaryHabits());
        history.setPhysicalActivity(historyDTO.getPhysicalActivity());
        history.setAlcoholConsumption(historyDTO.getAlcoholConsumption());
        history.setTobaccoUse(historyDTO.getTobaccoUse());
        history.setCurrentMedications(historyDTO.getCurrentMedications());
        history.setAllergies(historyDTO.getAllergies());
        history.setFoodIntolerances(historyDTO.getFoodIntolerances());
        history.setNutritionalGoal(historyDTO.getNutritionalGoal());
        history.setDietaryRestrictions(historyDTO.getDietaryRestrictions());
        history.setNotes(historyDTO.getNotes());

        history = clinicalHistoryRepository.save(history);
        patient.setClinicalHistory(history);
        Patient updatedPatient = patientRepository.save(patient);

        return convertToDTO(updatedPatient);
    }

    public PatientDTO updateBiometrics(Long patientId, BiometricsDTO biometricsDTO) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        Biometrics biometrics = patient.getBiometrics();
        if (biometrics == null) {
            biometrics = new Biometrics();
        }

        // Update all fields
        biometrics.setGlucose(biometricsDTO.getGlucose());
        biometrics.setHemoglobinA1c(biometricsDTO.getHemoglobinA1c());
        biometrics.setTotalCholesterol(biometricsDTO.getTotalCholesterol());
        biometrics.setLdlCholesterol(biometricsDTO.getLdlCholesterol());
        biometrics.setHdlCholesterol(biometricsDTO.getHdlCholesterol());
        biometrics.setTriglycerides(biometricsDTO.getTriglycerides());
        biometrics.setVldlCholesterol(biometricsDTO.getVldlCholesterol());
        biometrics.setAst(biometricsDTO.getAst());
        biometrics.setAlt(biometricsDTO.getAlt());
        biometrics.setGgt(biometricsDTO.getGgt());
        biometrics.setBilirubin(biometricsDTO.getBilirubin());
        biometrics.setCreatinine(biometricsDTO.getCreatinine());
        biometrics.setBun(biometricsDTO.getBun());
        biometrics.setTotalProteins(biometricsDTO.getTotalProteins());
        biometrics.setAlbumin(biometricsDTO.getAlbumin());
        biometrics.setPrealbumin(biometricsDTO.getPrealbumin());
        biometrics.setHemoglobin(biometricsDTO.getHemoglobin());
        biometrics.setHematocrit(biometricsDTO.getHematocrit());
        biometrics.setWhiteBloodCells(biometricsDTO.getWhiteBloodCells());
        biometrics.setPlatelets(biometricsDTO.getPlatelets());
        biometrics.setVitaminB12(biometricsDTO.getVitaminB12());
        biometrics.setFolacin(biometricsDTO.getFolacin());
        biometrics.setIron(biometricsDTO.getIron());
        biometrics.setFerritin(biometricsDTO.getFerritin());
        biometrics.setZinc(biometricsDTO.getZinc());
        biometrics.setCalcium(biometricsDTO.getCalcium());
        biometrics.setMagnesium(biometricsDTO.getMagnesium());
        biometrics.setPhosphorus(biometricsDTO.getPhosphorus());
        biometrics.setMeasuredDate(biometricsDTO.getMeasuredDate());

        biometrics = biometricsRepository.save(biometrics);
        patient.setBiometrics(biometrics);
        Patient updatedPatient = patientRepository.save(patient);

        return convertToDTO(updatedPatient);
    }

    public PatientDTO updateAnthropometry(Long patientId, AnthropometryDTO anthropometryDTO) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        Anthropometry anthropometry = patient.getAnthropometry();
        if (anthropometry == null) {
            anthropometry = new Anthropometry();
        }

        // Update all fields
        anthropometry.setWeight(anthropometryDTO.getWeight());
        anthropometry.setHeight(anthropometryDTO.getHeight());
        anthropometry.setWaistCircumference(anthropometryDTO.getWaistCircumference());
        anthropometry.setHipCircumference(anthropometryDTO.getHipCircumference());
        anthropometry.setArmCircumference(anthropometryDTO.getArmCircumference());
        anthropometry.setThighCircumference(anthropometryDTO.getThighCircumference());
        anthropometry.setTricepsSkinFold(anthropometryDTO.getTricepsSkinFold());
        anthropometry.setBicepsSkinFold(anthropometryDTO.getBicepsSkinFold());
        anthropometry.setSubscapularSkinFold(anthropometryDTO.getSubscapularSkinFold());
        anthropometry.setSuprailiacSkinFold(anthropometryDTO.getSuprailiacSkinFold());
        anthropometry.setMuscleMass(anthropometryDTO.getMuscleMass());
        anthropometry.setBoneMass(anthropometryDTO.getBoneMass());
        anthropometry.setWaterPercentage(anthropometryDTO.getWaterPercentage());
        anthropometry.setFatPercentage(anthropometryDTO.getFatPercentage());
        anthropometry.setMeasuredDate(anthropometryDTO.getMeasuredDate());
        anthropometry.calculateMetrics();

        anthropometry = anthropometryRepository.save(anthropometry);
        patient.setAnthropometry(anthropometry);
        Patient updatedPatient = patientRepository.save(patient);

        return convertToDTO(updatedPatient);
    }

    private PatientDTO convertToDTO(Patient patient) {
        return PatientDTO.builder()
                .id(patient.getId())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .email(patient.getEmail())
                .phone(patient.getPhone())
                .dateOfBirth(patient.getDateOfBirth())
                .gender(patient.getGender())
                .address(patient.getAddress())
                .occupation(patient.getOccupation())
                .createdAt(patient.getCreatedAt())
                .clinicalHistory(convertClinicalHistoryToDTO(patient.getClinicalHistory()))
                .biometrics(convertBiometricsToDTO(patient.getBiometrics()))
                .anthropometry(convertAnthropometryToDTO(patient.getAnthropometry()))
                .build();
    }

    private ClinicalHistoryDTO convertClinicalHistoryToDTO(ClinicalHistory history) {
        if (history == null) return null;
        return ClinicalHistoryDTO.builder()
                .id(history.getId())
                .medicalHistory(history.getMedicalHistory())
                .surgicalHistory(history.getSurgicalHistory())
                .familyHistory(history.getFamilyHistory())
                .pastDiseases(history.getPastDiseases())
                .complaint(history.getComplaint())
                .dietaryHabits(history.getDietaryHabits())
                .physicalActivity(history.getPhysicalActivity())
                .alcoholConsumption(history.getAlcoholConsumption())
                .tobaccoUse(history.getTobaccoUse())
                .currentMedications(history.getCurrentMedications())
                .allergies(history.getAllergies())
                .foodIntolerances(history.getFoodIntolerances())
                .nutritionalGoal(history.getNutritionalGoal())
                .dietaryRestrictions(history.getDietaryRestrictions())
                .notes(history.getNotes())
                .build();
    }

    private BiometricsDTO convertBiometricsToDTO(Biometrics biometrics) {
        if (biometrics == null) return null;
        return BiometricsDTO.builder()
                .id(biometrics.getId())
                .glucose(biometrics.getGlucose())
                .hemoglobinA1c(biometrics.getHemoglobinA1c())
                .totalCholesterol(biometrics.getTotalCholesterol())
                .ldlCholesterol(biometrics.getLdlCholesterol())
                .hdlCholesterol(biometrics.getHdlCholesterol())
                .triglycerides(biometrics.getTriglycerides())
                .vldlCholesterol(biometrics.getVldlCholesterol())
                .ast(biometrics.getAst())
                .alt(biometrics.getAlt())
                .ggt(biometrics.getGgt())
                .bilirubin(biometrics.getBilirubin())
                .creatinine(biometrics.getCreatinine())
                .bun(biometrics.getBun())
                .totalProteins(biometrics.getTotalProteins())
                .albumin(biometrics.getAlbumin())
                .prealbumin(biometrics.getPrealbumin())
                .hemoglobin(biometrics.getHemoglobin())
                .hematocrit(biometrics.getHematocrit())
                .whiteBloodCells(biometrics.getWhiteBloodCells())
                .platelets(biometrics.getPlatelets())
                .vitaminB12(biometrics.getVitaminB12())
                .folacin(biometrics.getFolacin())
                .iron(biometrics.getIron())
                .ferritin(biometrics.getFerritin())
                .zinc(biometrics.getZinc())
                .calcium(biometrics.getCalcium())
                .magnesium(biometrics.getMagnesium())
                .phosphorus(biometrics.getPhosphorus())
                .measuredDate(biometrics.getMeasuredDate())
                .build();
    }

    private AnthropometryDTO convertAnthropometryToDTO(Anthropometry anthropometry) {
        if (anthropometry == null) return null;
        return AnthropometryDTO.builder()
                .id(anthropometry.getId())
                .weight(anthropometry.getWeight())
                .height(anthropometry.getHeight())
                .bmi(anthropometry.getBmi())
                .waistCircumference(anthropometry.getWaistCircumference())
                .hipCircumference(anthropometry.getHipCircumference())
                .waistHipRatio(anthropometry.getWaistHipRatio())
                .armCircumference(anthropometry.getArmCircumference())
                .thighCircumference(anthropometry.getThighCircumference())
                .tricepsSkinFold(anthropometry.getTricepsSkinFold())
                .bicepsSkinFold(anthropometry.getBicepsSkinFold())
                .subscapularSkinFold(anthropometry.getSubscapularSkinFold())
                .suprailiacSkinFold(anthropometry.getSuprailiacSkinFold())
                .muscleMass(anthropometry.getMuscleMass())
                .boneMass(anthropometry.getBoneMass())
                .waterPercentage(anthropometry.getWaterPercentage())
                .fatPercentage(anthropometry.getFatPercentage())
                .measuredDate(anthropometry.getMeasuredDate())
                .build();
    }
}
