package com.srujan.querystackk.dto.response;


import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityResponse {

    private Long id;
    private String name;
    private String description;
    private String bannerUrl;
    private String iconUrl;
    private Integer memberCount;
    private Boolean isPrivate;
    private UserResponse createdBy;
    private LocalDateTime createdAt;
}