package com.srujan.querystackk.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCommunityRequest {

    @NotBlank(message = "Community name is required")
    @Size(min = 3, max = 50)
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Only letters, numbers, and underscores allowed")
    private String name;

    @Size(max = 1000)
    private String description;

    private String bannerUrl;

    private String iconUrl;

    private Boolean isPrivate;
}
