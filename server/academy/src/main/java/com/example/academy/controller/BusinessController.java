package com.example.academy.controller;

import com.example.academy.service.BusinessService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/business")
@RequiredArgsConstructor
public class BusinessController {

    private final BusinessService businessService;

    @PostMapping("/verify")
    public String verify(@RequestBody Map<String, String> payload) {
        String businessNumber = payload.get("businessNumber");
        return businessService.verify(businessNumber);
    }
}
