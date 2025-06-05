package com.example.academy.controller;

import com.example.academy.dto.ReviewRequest;
import com.example.academy.dto.ReviewResponse;
import com.example.academy.model.Review;
import com.example.academy.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // ✅ 리뷰 목록 조회
    @GetMapping("/api/academies/{academyId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getReviewsByAcademy(@PathVariable Long academyId) {
        return ResponseEntity.ok(reviewService.findByAcademyId(academyId));
    }

    // ✅ 리뷰 작성
    @PostMapping("/api/reviews")
    public ResponseEntity<Review> writeReview(@RequestBody ReviewRequest dto) {
        return ResponseEntity.ok(reviewService.create(dto));
    }

    @PutMapping("/api/reviews/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody ReviewRequest dto) {
        return ResponseEntity.ok(reviewService.update(id, dto.getComment(), dto.getRating()));
    }

    @DeleteMapping("/api/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.delete(id);
        return ResponseEntity.ok().build();
    }

}
