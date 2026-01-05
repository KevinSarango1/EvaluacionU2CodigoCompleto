package com.nutricion.repository;

import com.nutricion.entity.Biometrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BiometricsRepository extends JpaRepository<Biometrics, Long> {
}
