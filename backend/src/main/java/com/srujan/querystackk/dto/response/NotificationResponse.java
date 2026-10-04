package com.srujan.querystackk.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;
    private UserResponse actor;
    private String type;
    private Long referenceId;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;
}