package com.srujan.querystackk.controller;

import com.srujan.querystackk.dto.request.CreateCommunityRequest;
import com.srujan.querystackk.dto.response.ApiResponse;
import com.srujan.querystackk.dto.response.CommunityResponse;
import com.srujan.querystackk.dto.response.PageResponse;
import com.srujan.querystackk.service.CommunityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communities")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    @PostMapping
    public ResponseEntity<ApiResponse<CommunityResponse>> createCommunity(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateCommunityRequest request) {
        CommunityResponse response = communityService.createCommunity(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Community created", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CommunityResponse>>> getAllCommunities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Communities fetched",
                communityService.getAllCommunities(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CommunityResponse>> getCommunityById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Community fetched",
                communityService.getCommunityById(id)));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<ApiResponse<CommunityResponse>> getCommunityByName(@PathVariable String name) {
        return ResponseEntity.ok(ApiResponse.success("Community fetched",
                communityService.getCommunityByName(name)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<CommunityResponse>>> searchCommunities(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Communities found",
                communityService.searchCommunities(keyword, page, size)));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<ApiResponse<Void>> joinCommunity(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        communityService.joinCommunity(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Joined community", null));
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<ApiResponse<Void>> leaveCommunity(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        communityService.leaveCommunity(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Left community", null));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<CommunityResponse>>> getMyCommunities(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("My communities",
                communityService.getMyCommunities(userDetails.getUsername())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCommunity(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        communityService.deleteCommunity(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Community deleted", null));
    }
}
