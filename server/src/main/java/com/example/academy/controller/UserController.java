package com.example.academy.controller;

import com.example.academy.model.User;
import com.example.academy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody User user) {
        if (userService.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body("이미 존재하는 이메일입니다.");
        }
        userService.register(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, String>> getUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByEmail(auth.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Map<String, String> result = new HashMap<>();
        result.put("name", user.getName());
        result.put("email", user.getEmail());
        result.put("role", user.getRole());
        return ResponseEntity.ok(result);
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
