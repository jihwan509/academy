package com.example.academy.service;

import com.example.academy.dto.ReviewRequest;
import com.example.academy.dto.ReviewResponse;
import com.example.academy.model.Academy;
import com.example.academy.model.Review;
import com.example.academy.repository.AcademyRepository;
import com.example.academy.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final AcademyRepository academyRepository;

    // ✅ 리뷰 목록 조회
    public List<ReviewResponse> findByAcademyId(Long academyId) {
        Academy academy = academyRepository.findById(academyId)
                .orElseThrow(() -> new RuntimeException("해당 학원이 존재하지 않습니다."));

        return reviewRepository.findByAcademy(academy).stream()
                .map(review -> ReviewResponse.builder()
                        .id(review.getId())
                        .userEmail(review.getUserEmail())
                        .rating(review.getRating())
                        .comment(review.getComment())
                        .createdAt(review.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    // ✅ 리뷰 작성
    public Review create(ReviewRequest dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth.getName();

        Academy academy = academyRepository.findById(dto.getAcademyId())
                .orElseThrow(() -> new RuntimeException("해당 학원이 존재하지 않습니다"));

        Review review = Review.builder()
                .academy(academy)
                .userEmail(userEmail)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .build();

        return reviewRepository.save(review);
    }

    public Review update(Long reviewId, String newComment, int newRating) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰 없음"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        if (!review.getUserEmail().equals(email)) {
            throw new RuntimeException("본인만 수정 가능합니다");
        }

        review.setComment(newComment);
        review.setRating(newRating);
        return reviewRepository.save(review);
    }

    public void delete(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰 없음"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        if (!review.getUserEmail().equals(email)) {
            throw new RuntimeException("본인만 삭제 가능합니다");
        }

        reviewRepository.deleteById(reviewId);
    }

}
