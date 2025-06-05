package com.example.academy.controller;

import com.example.academy.model.User;
import com.example.academy.repository.UserRepository;
import com.example.academy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody User user) {
        if (userService.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body("이미 존재하는 이메일입니다.");
        }
        userService.register(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByEmail(auth.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Map<String, Object> result = new HashMap<>();
        result.put("name", user.getName());
        result.put("email", user.getEmail());
        result.put("role", user.getRole());
        result.put("profileImageUrl", user.getProfileImageUrl());
        result.put("joinedAt", user.getCreatedAt());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/user/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByEmail(auth.getName());

        String currentPw = request.get("currentPassword");
        String newPw = request.get("newPassword");

        if (!passwordEncoder.matches(currentPw, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("현재 비밀번호가 일치하지 않습니다.");
        }

        user.setPassword(passwordEncoder.encode(newPw));
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/image")
    public ResponseEntity<?> updateProfileImage(@RequestParam("file") MultipartFile file) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByEmail(auth.getName());

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("파일이 없습니다.");
        }

        // 실제 파일 저장 로직 필요 (예: S3, 서버 디렉토리 등)
        String filePath = "/images/profile/" + file.getOriginalFilename();

        user.setProfileImageUrl(filePath);
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin")
    public ResponseEntity<String> getAdminPage() {
        return ResponseEntity.ok("Admin access granted");
    }

    @GetMapping("/logoutOk")
    public ResponseEntity<Void> logoutOk() {
        return ResponseEntity.ok().build();
    }
}
