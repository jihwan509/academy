package com.example.academy.controller;

import com.example.academy.dto.AcademyResponse;
import com.example.academy.model.Academy;
import com.example.academy.service.AcademyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academies")
@RequiredArgsConstructor
public class AcademyController {

    private final AcademyService academyService;

    @GetMapping
    public List<AcademyResponse> findAll(@RequestParam(required = false) String search) {
        return academyService.findAllFiltered(search);
    }

    @GetMapping("/{id}")
    public AcademyResponse findById(@PathVariable Long id) {
        return academyService.findByIdAsDto(id);
    }

    @GetMapping("/top-rated")
    public List<AcademyResponse> getTopRated() {
        return academyService.findTopRated();
    }

    @GetMapping("/most-reviewed")
    public List<AcademyResponse> getMostReviewed() {
        return academyService.findMostReviewed();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Academy> create(@RequestBody Academy academy) {
        return ResponseEntity.ok(academyService.save(academy));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Academy> update(@PathVariable Long id, @RequestBody Academy updated) {
        return ResponseEntity.ok(academyService.update(id, updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        academyService.delete(id);
        return ResponseEntity.ok().build();
    }
}
