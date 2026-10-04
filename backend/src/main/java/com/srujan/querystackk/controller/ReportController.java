package com.srujan.querystackk.controller;


import com.srujan.querystackk.dto.request.ReportRequest;
import com.srujan.querystackk.dto.response.ApiResponse;
import com.srujan.querystackk.dto.response.PageResponse;
import com.srujan.querystackk.dto.response.ReportResponse;
import com.srujan.querystackk.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReportResponse>> createReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReportRequest request) {
        ReportResponse response = reportService.createReport(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Report submitted", response));
    }

    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<PageResponse<ReportResponse>>> getReportsByStatus(
            @RequestParam(defaultValue = "PENDING") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success("Reports fetched",
                reportService.getReportsByStatus(status, page, size)));
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<ReportResponse>> updateReportStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success("Report status updated",
                reportService.updateReportStatus(id, status)));
    }

    @GetMapping("/admin/pending-count")
    public ResponseEntity<ApiResponse<Long>> countPending() {
        return ResponseEntity.ok(ApiResponse.success("Pending count",
                reportService.countPendingReports()));
    }
}