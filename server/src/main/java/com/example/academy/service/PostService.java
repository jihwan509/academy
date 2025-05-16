package com.example.academy.service;

import com.example.academy.model.Post;
import com.example.academy.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public List<Post> findAll() {
        return postRepository.findAll();
    }

    public Post findById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 게시글을 찾을 수 없습니다."));
    }

    public Post save(Post post) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        if ("anonymousUser".equals(email)) {
            throw new RuntimeException("로그인이 필요합니다.");
        }

        post.setAuthorEmail(email);
        return postRepository.save(post);
    }

    public Post update(Long id, Post updated) {
        Post post = findById(id);
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!post.getAuthorEmail().equals(email)) {
            throw new RuntimeException("본인만 수정할 수 있습니다.");
        }

        post.setTitle(updated.getTitle());
        post.setContent(updated.getContent());
        return postRepository.save(post);
    }

    public void delete(Long id) {
        Post post = findById(id);
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!post.getAuthorEmail().equals(email)) {
            throw new RuntimeException("본인만 삭제할 수 있습니다.");
        }

        postRepository.deleteById(id);
    }
}
