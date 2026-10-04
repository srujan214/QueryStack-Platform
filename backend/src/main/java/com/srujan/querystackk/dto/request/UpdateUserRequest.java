package com.srujan.querystackk.dto.request;


import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserRequest {

    @Size(max = 100)
    private String displayName;

    @Size(max = 500)
    private String bio;

    private String profilePictureUrl;
}