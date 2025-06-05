package com.example.academy.repository;

import com.example.academy.model.Academy;
import com.example.academy.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByAcademy(Academy academy);
}