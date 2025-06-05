package com.example.academy.controller;

import com.example.academy.model.Post;
import com.example.academy.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public List<Post> getAll() {
        return postService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Post post) {
        Post savedPost = postService.save(post);
        Map<String, Object> result = new HashMap<>();
        result.put("id", savedPost.getId());
        result.put("title", savedPost.getTitle());
        result.put("content", savedPost.getContent());
        result.put("authorEmail", savedPost.getAuthorEmail());
        result.put("createdAt", savedPost.getCreatedAt());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> update(@PathVariable Long id, @RequestBody Post post) {
        return ResponseEntity.ok(postService.update(id, post));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.ok().build();
    }
}
