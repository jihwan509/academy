package com.example.academy.service;

import com.example.academy.model.Comment;
import com.example.academy.model.Post;
import com.example.academy.repository.CommentRepository;
import com.example.academy.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public List<Comment> findByPostId(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글 없음"));
        return commentRepository.findByPost(post);
    }

    public Comment save(Long postId, String content) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        if ("anonymousUser".equals(email)) {
            throw new RuntimeException("로그인이 필요합니다.");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글 없음"));

        Comment comment = Comment.builder()
                .post(post)
                .authorEmail(email)
                .content(content)
                .build();

        return commentRepository.save(comment);
    }
}
