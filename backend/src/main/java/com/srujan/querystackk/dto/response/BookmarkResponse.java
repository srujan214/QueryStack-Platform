package com.srujan.querystackk.dto.response;


import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookmarkResponse {

    private Long id;
    private PostResponse post;
    private LocalDateTime savedAt;
}