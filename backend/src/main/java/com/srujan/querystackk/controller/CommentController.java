package com.srujan.querystackk.controller;

import com.srujan.querystackk.dto.request.CreateCommentRequest;
import com.srujan.querystackk.dto.response.ApiResponse;
import com.srujan.querystackk.dto.response.CommentResponse;
import com.srujan.querystackk.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateCommentRequest request) {
        CommentResponse response = commentService.createComment(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Comment created", response));
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getCommentsByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(ApiResponse.success("Comments fetched",
                commentService.getCommentsByPost(postId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestParam String content) {
        CommentResponse response = commentService.updateComment(userDetails.getUsername(), id, content);
        return ResponseEntity.ok(ApiResponse.success("Comment updated", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        commentService.deleteComment(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted", null));
    }
}
