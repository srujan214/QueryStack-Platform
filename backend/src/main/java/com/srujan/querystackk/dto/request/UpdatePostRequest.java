package com.srujan.querystackk.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdatePostRequest {

    @Size(min = 3, max = 300)
    private String title;

    @Size(max = 10000)
    private String content;

    private String imageUrl;

    private Set<String> tags;
}