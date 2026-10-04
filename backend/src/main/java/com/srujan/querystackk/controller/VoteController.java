package com.srujan.querystackk.controller;


import com.srujan.querystackk.dto.request.VoteRequest;
import com.srujan.querystackk.dto.response.ApiResponse;
import com.srujan.querystackk.dto.response.VoteResponse;
import com.srujan.querystackk.service.VoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    @PostMapping("/post")
    public ResponseEntity<ApiResponse<VoteResponse>> votePost(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody VoteRequest request) {
        VoteResponse response = voteService.votePost(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Vote recorded", response));
    }

    @PostMapping("/comment")
    public ResponseEntity<ApiResponse<VoteResponse>> voteComment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody VoteRequest request) {
        VoteResponse response = voteService.voteComment(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Vote recorded", response));
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<ApiResponse<Integer>> getUserPostVote(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long postId) {
        return ResponseEntity.ok(ApiResponse.success("Vote status",
                voteService.getUserPostVote(userDetails.getUsername(), postId)));
    }

    @GetMapping("/comment/{commentId}")
    public ResponseEntity<ApiResponse<Integer>> getUserCommentVote(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long commentId) {
        return ResponseEntity.ok(ApiResponse.success("Vote status",
                voteService.getUserCommentVote(userDetails.getUsername(), commentId)));
    }
}