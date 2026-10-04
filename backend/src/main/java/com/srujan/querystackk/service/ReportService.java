package com.srujan.querystackk.service;


import com.srujan.querystackk.dto.request.ReportRequest;
import com.srujan.querystackk.dto.response.PageResponse;
import com.srujan.querystackk.dto.response.ReportResponse;
import com.srujan.querystackk.entity.Comment;
import com.srujan.querystackk.entity.Post;
import com.srujan.querystackk.entity.Report;
import com.srujan.querystackk.entity.User;
import com.srujan.querystackk.exception.BadRequestException;
import com.srujan.querystackk.exception.ResourceNotFoundException;
import com.srujan.querystackk.exception.UnauthorizedException;
import com.srujan.querystackk.mapper.DtoMapper;
import com.srujan.querystackk.repository.CommentRepository;
import com.srujan.querystackk.repository.PostRepository;
import com.srujan.querystackk.repository.ReportRepository;
import com.srujan.querystackk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final DtoMapper mapper;

    @Transactional
    public ReportResponse createReport(String username, ReportRequest request) {
        if (request.getPostId() == null && request.getCommentId() == null) {
            throw new BadRequestException("Either postId or commentId must be provided");
        }

        User reporter = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Post post = null;
        Comment comment = null;

        if (request.getPostId() != null) {
            post = postRepository.findById(request.getPostId())
                    .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        }

        if (request.getCommentId() != null) {
            comment = commentRepository.findById(request.getCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        }

        Report report = Report.builder()
                .reporter(reporter)
                .post(post)
                .comment(comment)
                .reason(request.getReason())
                .description(request.getDescription())
                .status(Report.ReportStatus.PENDING)
                .build();

        report = reportRepository.save(report);
        return mapper.toReportResponse(report);
    }

    public PageResponse<ReportResponse> getReportsByStatus(String status, int page, int size) {
        Report.ReportStatus reportStatus;
        try {
            reportStatus = Report.ReportStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status. Use PENDING, REVIEWED, RESOLVED, or DISMISSED");
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Report> reports = reportRepository.findByStatusOrderByCreatedAtDesc(reportStatus, pageable);

        return PageResponse.from(reports.map(mapper::toReportResponse));
    }

    @Transactional
    public ReportResponse updateReportStatus(Long reportId, String newStatus) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        Report.ReportStatus status;
        try {
            status = Report.ReportStatus.valueOf(newStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status");
        }

        report.setStatus(status);
        reportRepository.save(report);
        return mapper.toReportResponse(report);
    }

    public Long countPendingReports() {
        return reportRepository.countByStatus(Report.ReportStatus.PENDING);
    }

    @Transactional
    public void deleteReport(String username, Long reportId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        if (!report.getReporter().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only delete your own reports");
        }

        reportRepository.delete(report);
    }
}
