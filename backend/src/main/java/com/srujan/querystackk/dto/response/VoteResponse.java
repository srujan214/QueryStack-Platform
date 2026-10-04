package com.srujan.querystackk.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoteResponse {

    private Long id;
    private String voteType;
    private Long postId;
    private Long commentId;
    private Integer newVoteCount;
}