package com.srujan.querystackk.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportResponse {

    private Long id;
    private UserResponse reporter;
    private Long postId;
    private Long commentId;
    private String reason;
    private String description;
    private String status;
    private LocalDateTime createdAt;
}