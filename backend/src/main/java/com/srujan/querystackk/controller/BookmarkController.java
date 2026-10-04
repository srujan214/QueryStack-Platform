package com.srujan.querystackk.controller;


import com.srujan.querystackk.dto.response.ApiResponse;
import com.srujan.querystackk.dto.response.BookmarkResponse;
import com.srujan.querystackk.dto.response.PageResponse;
import com.srujan.querystackk.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @PostMapping("/{postId}")
    public ResponseEntity<ApiResponse<BookmarkResponse>> saveBookmark(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long postId) {
        BookmarkResponse response = bookmarkService.saveBookmark(userDetails.getUsername(), postId);
        return ResponseEntity.ok(ApiResponse.success("Post bookmarked", response));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<ApiResponse<Void>> removeBookmark(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long postId) {
        bookmarkService.removeBookmark(userDetails.getUsername(), postId);
        return ResponseEntity.ok(ApiResponse.success("Bookmark removed", null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<BookmarkResponse>>> getMyBookmarks(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Bookmarks fetched",
                bookmarkService.getMyBookmarks(userDetails.getUsername(), page, size)));
    }

    @GetMapping("/check/{postId}")
    public ResponseEntity<ApiResponse<Boolean>> isBookmarked(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long postId) {
        return ResponseEntity.ok(ApiResponse.success("Bookmark status",
                bookmarkService.isBookmarked(userDetails.getUsername(), postId)));
    }
}