package com.srujan.querystackk.service;

import com.srujan.querystackk.exception.BadRequestException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
            log.info("📁 Upload directory ready: {}", Paths.get(uploadDir).toAbsolutePath());
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public String saveFile(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File too large. Max 5MB.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Only image files are allowed");
        }

        String original = file.getOriginalFilename();
        String extension = "";
        if (original != null && original.contains(".")) {
            extension = original.substring(original.lastIndexOf(".")).toLowerCase();
        }

        // Basic extension whitelist
        if (!extension.matches("\\.(jpg|jpeg|png|gif|webp|svg)")) {
            throw new BadRequestException("Unsupported file type");
        }

        String filename = UUID.randomUUID().toString() + extension;

        try {
            Path folderPath = Paths.get(uploadDir, folder);
            Files.createDirectories(folderPath);

            Path targetPath = folderPath.resolve(filename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String url = "/uploads/" + folder + "/" + filename;
            log.info("✅ File saved: {}", url);
            return url;
        } catch (IOException e) {
            throw new BadRequestException("Failed to save file: " + e.getMessage());
        }
    }

    public void deleteFile(String url) {
        if (url == null || !url.startsWith("/uploads/")) return;
        try {
            String relative = url.substring("/uploads/".length());
            Path path = Paths.get(uploadDir, relative);
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.warn("Failed to delete file: {}", url);
        }
    }
}