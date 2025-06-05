package com.example.academy.controller;

import com.example.academy.model.Comment;
import com.example.academy.service.CommentService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/{postId}")
    public List<Comment> getComments(@PathVariable Long postId) {
        return commentService.findByPostId(postId);
    }

    @PostMapping
    public ResponseEntity<Comment> write(@RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.save(request.getPostId(), request.getContent()));
    }

    @Data
    public static class CommentRequest {
        private Long postId;
        private String content;
    }
}
