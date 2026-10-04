package com.srujan.querystackk.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoteRequest {

    private Long postId;

    private Long commentId;

    @NotBlank(message = "Vote type is required")
    private String voteType;
}