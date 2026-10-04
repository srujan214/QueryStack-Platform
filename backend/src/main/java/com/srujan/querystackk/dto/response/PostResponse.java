package com.srujan.querystackk.dto.response;


import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponse {

    private Long id;
    private String title;
    private String content;
    private String imageUrl;
    private String postType;
    private Integer voteCount;
    private Integer commentCount;
    private Boolean locked;
    private UserResponse author;
    private CommunityResponse community;
    private Set<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
