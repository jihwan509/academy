package com.example.academy.repository;

import com.example.academy.model.Academy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AcademyRepository extends JpaRepository<Academy, Long> {
    List<Academy> findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(String name, String location);
}