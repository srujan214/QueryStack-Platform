package com.srujan.querystackk.dto.response;


import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String displayName;
    private String bio;
    private String profilePictureUrl;
    private Integer karmaPoints;
    private Boolean enabled;
    private Set<String> roles;
    private LocalDateTime createdAt;
}