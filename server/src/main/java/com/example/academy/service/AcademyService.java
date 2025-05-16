package com.example.academy.service;

import com.example.academy.dto.AcademyResponse;
import com.example.academy.model.Academy;
import com.example.academy.model.Review;
import com.example.academy.repository.AcademyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AcademyService {

    private final AcademyRepository academyRepository;

    public List<AcademyResponse> findAllFiltered(String search) {
        List<Academy> academies = (search == null || search.isBlank())
                ? academyRepository.findAll()
                : academyRepository.findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(search, search);

        return academies.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Academy findById(Long id) {
        return academyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 학원이 존재하지 않습니다."));
    }

    public AcademyResponse findByIdAsDto(Long id) {
        return toDto(findById(id));
    }

    public Academy save(Academy academy) {
        return academyRepository.save(academy);
    }

    public Academy update(Long id, Academy updated) {
        Academy existing = findById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setLocation(updated.getLocation());
        existing.setImageUrl(updated.getImageUrl());
        return academyRepository.save(existing);
    }

    public void delete(Long id) {
        academyRepository.deleteById(id);
    }

    public List<AcademyResponse> findTopRated() {
        return academyRepository.findAll().stream()
                .filter(a -> !a.getReviews().isEmpty())
                .sorted((a, b) -> {
                    double avgA = a.getReviews().stream().mapToInt(Review::getRating).average().orElse(0);
                    double avgB = b.getReviews().stream().mapToInt(Review::getRating).average().orElse(0);
                    return Double.compare(avgB, avgA); // 별점 높은 순
                })
                .limit(3)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<AcademyResponse> findMostReviewed() {
        return academyRepository.findAll().stream()
                .sorted((a, b) -> Integer.compare(b.getReviews().size(), a.getReviews().size()))
                .limit(3)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private AcademyResponse toDto(Academy academy) {
        Double avgRating = academy.getReviews().isEmpty() ? null :
                academy.getReviews().stream()
                        .mapToInt(Review::getRating)
                        .average()
                        .orElse(0.0);

        return AcademyResponse.builder()
                .id(academy.getId())
                .name(academy.getName())
                .description(academy.getDescription())
                .location(academy.getLocation())
                .imageUrl(academy.getImageUrl())
                .createdAt(academy.getCreatedAt())
                .averageRating(avgRating)
                .build();
    }
}
