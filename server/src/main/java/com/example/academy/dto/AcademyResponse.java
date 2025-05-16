package com.example.academy.dto;

import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Builder
public class AcademyResponse {
    private Long id;
    private String name;
    private String description;
    private String location;
    private String imageUrl;
    private Timestamp createdAt;
    private Double averageRating;
}