package com.example.academy.controller;

import com.example.academy.model.User;
import com.example.academy.service.BusinessService;
import com.example.academy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminJoinController {

    private final BusinessService businessService;
    private final UserService userService;

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String password = payload.get("password");
        String businessNumber = payload.get("businessNumber");

        // 사업자등록번호 인증
        String result = businessService.verify(businessNumber);
        if (!result.contains("유효한")) {
            return ResponseEntity.badRequest().body("❌ 관리자 가입 실패: " + result);
        }

        // 관리자 회원 생성
        User user = User.builder()
                .name(name)
                .email(email)
                .password(password)
                .role("ROLE_ADMIN")
                .build();

        userService.registerAdmin(user);
        return ResponseEntity.ok("🎉 관리자 가입 성공");
    }
}
