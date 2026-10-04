package com.srujan.querystackk.service;


import com.srujan.querystackk.dto.request.CreatePostRequest;
import com.srujan.querystackk.dto.request.UpdatePostRequest;
import com.srujan.querystackk.dto.response.PageResponse;
import com.srujan.querystackk.dto.response.PostResponse;
import com.srujan.querystackk.entity.*;
import com.srujan.querystackk.exception.ResourceNotFoundException;
import com.srujan.querystackk.exception.UnauthorizedException;
import com.srujan.querystackk.mapper.DtoMapper;
import com.srujan.querystackk.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final TagRepository tagRepository;
    private final DtoMapper mapper;

    @Transactional
    public PostResponse createPost(String username, CreatePostRequest request) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Community community = communityRepository.findById(request.getCommunityId())
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));

        Set<Tag> tags = new HashSet<>();
        if (request.getTags() != null) {
            for (String tagName : request.getTags()) {
                String cleanName = tagName.trim().toLowerCase();
                Tag tag = tagRepository.findByName(cleanName)
                        .orElseGet(() -> tagRepository.save(
                                Tag.builder().name(cleanName).usageCount(0).build()));
                tag.setUsageCount(tag.getUsageCount() + 1);
                tagRepository.save(tag);
                tags.add(tag);
            }
        }

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .postType(request.getPostType())
                .author(author)
                .community(community)
                .tags(tags)
                .voteCount(0)
                .commentCount(0)
                .build();

        post = postRepository.save(post);
        return mapper.toPostResponse(post);
    }

    public PostResponse getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        if (post.getDeleted()) {
            throw new ResourceNotFoundException("Post has been deleted");
        }
        return mapper.toPostResponse(post);
    }

    public PageResponse<PostResponse> getRecentPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findRecentPosts(pageable);
        return PageResponse.from(posts.map(mapper::toPostResponse));
    }

    public PageResponse<PostResponse> getTrendingPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findTrendingPosts(pageable);
        return PageResponse.from(posts.map(mapper::toPostResponse));
    }

    public PageResponse<PostResponse> getPostsByCommunity(Long communityId, int page, int size) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findByCommunityAndDeletedFalse(community, pageable);
        return PageResponse.from(posts.map(mapper::toPostResponse));
    }

    public PageResponse<PostResponse> getPostsByAuthor(String username, int page, int size) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findByAuthor(author, pageable);
        return PageResponse.from(posts.map(mapper::toPostResponse));
    }

    public PageResponse<PostResponse> searchPosts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.searchPosts(keyword, pageable);
        return PageResponse.from(posts.map(mapper::toPostResponse));
    }

    public PageResponse<PostResponse> getPostsByTag(String tagName, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findByTagName(tagName, pageable);
        return PageResponse.from(posts.map(mapper::toPostResponse));
    }

    @Transactional
    public PostResponse updatePost(String username, Long postId, UpdatePostRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only edit your own posts");
        }

        if (request.getTitle() != null) post.setTitle(request.getTitle());
        if (request.getContent() != null) post.setContent(request.getContent());
        if (request.getImageUrl() != null) post.setImageUrl(request.getImageUrl());

        if (request.getTags() != null) {
            Set<Tag> tags = new HashSet<>();
            for (String tagName : request.getTags()) {
                String cleanName = tagName.trim().toLowerCase();
                Tag tag = tagRepository.findByName(cleanName)
                        .orElseGet(() -> tagRepository.save(
                                Tag.builder().name(cleanName).usageCount(0).build()));
                tags.add(tag);
            }
            post.setTags(tags);
        }

        postRepository.save(post);
        return mapper.toPostResponse(post);
    }

    @Transactional
    public void deletePost(String username, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only delete your own posts");
        }

        post.setDeleted(true);
        postRepository.save(post);
    }
}