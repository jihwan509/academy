package com.example.academy.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long academyId;
    private int rating;
    private String comment;
}