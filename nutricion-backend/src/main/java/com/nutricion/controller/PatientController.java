package com.nutricion.controller;

import com.nutricion.dto.PatientDTO;
import com.nutricion.dto.ClinicalHistoryDTO;
import com.nutricion.dto.BiometricsDTO;
import com.nutricion.dto.AnthropometryDTO;
import com.nutricion.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('NUTRITIONIST', 'ADMIN')")
    public ResponseEntity<PatientDTO> createPatient(@RequestBody PatientDTO patientDTO) {
        PatientDTO createdPatient = patientService.createPatient(patientDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPatient);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('NUTRITIONIST', 'ADMIN')")
    public ResponseEntity<List<PatientDTO>> getAllPatients() {
        List<PatientDTO> patients = patientService.getAllPatients();
        return ResponseEntity.ok(patients);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('NUTRITIONIST', 'ADMIN')")
    public ResponseEntity<PatientDTO> getPatientById(@PathVariable Long id) {
        PatientDTO patient = patientService.getPatientById(id);
        return ResponseEntity.ok(patient);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('NUTRITIONIST', 'ADMIN')")
    public ResponseEntity<PatientDTO> updatePatient(@PathVariable Long id,
                                                    @RequestBody PatientDTO patientDTO) {
        PatientDTO updatedPatient = patientService.updatePatient(id, patientDTO);
        return ResponseEntity.ok(updatedPatient);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/history")
    @PreAuthorize("hasAnyRole('NUTRITIONIST', 'ADMIN')")
    public ResponseEntity<PatientDTO> updateClinicalHistory(@PathVariable Long id,
                                                            @RequestBody ClinicalHistoryDTO historyDTO) {
        PatientDTO updatedPatient = patientService.updateClinicalHistory(id, historyDTO);
        return ResponseEntity.ok(updatedPatient);
    }

    @PutMapping("/{id}/biometrics")
    @PreAuthorize("hasAnyRole('NUTRITIONIST', 'ADMIN')")
    public ResponseEntity<PatientDTO> updateBiometrics(@PathVariable Long id,
                                                       @RequestBody BiometricsDTO biometricsDTO) {
        PatientDTO updatedPatient = patientService.updateBiometrics(id, biometricsDTO);
        return ResponseEntity.ok(updatedPatient);
    }

    @PutMapping("/{id}/anthropometry")
    @PreAuthorize("hasAnyRole('NUTRITIONIST', 'ADMIN')")
    public ResponseEntity<PatientDTO> updateAnthropometry(@PathVariable Long id,
                                                          @RequestBody AnthropometryDTO anthropometryDTO) {
        PatientDTO updatedPatient = patientService.updateAnthropometry(id, anthropometryDTO);
        return ResponseEntity.ok(updatedPatient);
    }
}
