package com.example.academy.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminJoinRequest {
    private String name;
    private String email;
    private String password;
    private String businessNumber;
}
