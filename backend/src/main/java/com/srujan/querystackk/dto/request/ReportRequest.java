package com.srujan.querystackk.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportRequest {

    private Long postId;

    private Long commentId;

    @NotBlank(message = "Reason is required")
    @Size(max = 100)
    private String reason;

    @Size(max = 1000)
    private String description;
}