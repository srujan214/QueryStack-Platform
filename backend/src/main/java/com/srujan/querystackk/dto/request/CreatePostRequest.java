package com.srujan.querystackk.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePostRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 300, message = "Title must be between 3 and 300 characters")
    private String title;

    @Size(max = 10000)
    private String content;

    private String imageUrl;

    @NotBlank(message = "Post type is required")
    private String postType;

    @NotNull(message = "Community is required")
    private Long communityId;

    private Set<String> tags;
}