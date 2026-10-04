package com.srujan.querystackk.controller;


import com.srujan.querystackk.dto.response.ApiResponse;
import com.srujan.querystackk.dto.response.PageResponse;
import com.srujan.querystackk.dto.response.TagResponse;
import com.srujan.querystackk.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<PageResponse<TagResponse>>> getPopularTags(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success("Popular tags",
                tagService.getPopularTags(page, size)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<TagResponse>>> searchTags(@RequestParam String keyword) {
        return ResponseEntity.ok(ApiResponse.success("Tags found",
                tagService.searchTags(keyword)));
    }

    @GetMapping("/{name}")
    public ResponseEntity<ApiResponse<TagResponse>> getTagByName(@PathVariable String name) {
        return ResponseEntity.ok(ApiResponse.success("Tag fetched",
                tagService.getTagByName(name)));
    }
}