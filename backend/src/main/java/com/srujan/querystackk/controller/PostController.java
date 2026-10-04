package com.srujan.querystackk.controller;


import com.srujan.querystackk.dto.request.CreatePostRequest;
import com.srujan.querystackk.dto.request.UpdatePostRequest;
import com.srujan.querystackk.dto.response.ApiResponse;
import com.srujan.querystackk.dto.response.PageResponse;
import com.srujan.querystackk.dto.response.PostResponse;
import com.srujan.querystackk.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<ApiResponse<PostResponse>> createPost(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreatePostRequest request) {
        PostResponse response = postService.createPost(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Post created", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Post fetched", postService.getPostById(id)));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> getRecentPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Recent posts",
                postService.getRecentPosts(page, size)));
    }

    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> getTrendingPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Trending posts",
                postService.getTrendingPosts(page, size)));
    }

    @GetMapping("/community/{communityId}")
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> getPostsByCommunity(
            @PathVariable Long communityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Posts in community",
                postService.getPostsByCommunity(communityId, page, size)));
    }

    @GetMapping("/author/{username}")
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> getPostsByAuthor(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("User's posts",
                postService.getPostsByAuthor(username, page, size)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Search results",
                postService.searchPosts(keyword, page, size)));
    }

    @GetMapping("/tag/{tagName}")
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> getPostsByTag(
            @PathVariable String tagName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Posts by tag",
                postService.getPostsByTag(tagName, page, size)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> updatePost(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequest request) {
        PostResponse response = postService.updatePost(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Post updated", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        postService.deletePost(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Post deleted", null));
    }
}
