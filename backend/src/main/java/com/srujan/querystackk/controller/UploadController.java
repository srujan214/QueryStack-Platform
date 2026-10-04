package com.srujan.querystackk.controller;

import com.srujan.querystackk.dto.response.ApiResponse;
import com.srujan.querystackk.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final FileStorageService fileStorageService;

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "type", defaultValue = "post") String type
    ) {
        String folder;
        switch (type.toLowerCase()) {
            case "avatar": folder = "avatars"; break;
            case "community-icon": folder = "community-icons"; break;
            case "community-banner": folder = "community-banners"; break;
            default: folder = "posts";
        }

        String url = fileStorageService.saveFile(file, folder);

        // Return the full absolute URL so frontend can use it directly
        String fullUrl = "http://localhost:8080" + url;

        return ResponseEntity.ok(
                ApiResponse.success("Image uploaded", Map.of("url", fullUrl))
        );
    }
}