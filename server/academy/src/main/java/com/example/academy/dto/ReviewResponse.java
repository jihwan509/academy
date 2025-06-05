package com.example.academy.dto;

import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Builder
public class ReviewResponse {
    private Long id;
    private String userEmail;
    private int rating;
    private String comment;
    private Timestamp createdAt;
}
