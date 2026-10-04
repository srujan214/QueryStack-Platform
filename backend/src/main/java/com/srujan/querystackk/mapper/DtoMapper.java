package com.srujan.querystackk.mapper;


import com.srujan.querystackk.dto.response.*;
import com.srujan.querystackk.entity.*;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class DtoMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .bio(user.getBio())
                .profilePictureUrl(user.getProfilePictureUrl())
                .karmaPoints(user.getKarmaPoints())
                .enabled(user.getEnabled())
                .roles(user.getRoles().stream()
                        .map(r -> r.getName().name())
                        .collect(Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .build();
    }

    public CommunityResponse toCommunityResponse(Community community) {
        if (community == null) return null;
        return CommunityResponse.builder()
                .id(community.getId())
                .name(community.getName())
                .description(community.getDescription())
                .bannerUrl(community.getBannerUrl())
                .iconUrl(community.getIconUrl())
                .memberCount(community.getMemberCount())
                .isPrivate(community.getIsPrivate())
                .createdBy(toUserResponse(community.getCreatedBy()))
                .createdAt(community.getCreatedAt())
                .build();
    }

    public PostResponse toPostResponse(Post post) {
        if (post == null) return null;
        Set<String> tagNames = post.getTags().stream()
                .map(Tag::getName)
                .collect(Collectors.toSet());

        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .imageUrl(post.getImageUrl())
                .postType(post.getPostType())
                .voteCount(post.getVoteCount())
                .commentCount(post.getCommentCount())
                .locked(post.getLocked())
                .author(toUserResponse(post.getAuthor()))
                .community(toCommunityResponse(post.getCommunity()))
                .tags(tagNames)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    public CommentResponse toCommentResponse(Comment comment) {
        if (comment == null) return null;
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .voteCount(comment.getVoteCount())
                .author(toUserResponse(comment.getAuthor()))
                .postId(comment.getPost() != null ? comment.getPost().getId() : null)
                .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .replies(comment.getReplies().stream()
                        .filter(r -> !r.getDeleted())
                        .map(this::toCommentResponse)
                        .collect(Collectors.toList()))
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

    public NotificationResponse toNotificationResponse(Notification notification) {
        if (notification == null) return null;
        return NotificationResponse.builder()
                .id(notification.getId())
                .actor(toUserResponse(notification.getActor()))
                .type(notification.getType().name())
                .referenceId(notification.getReferenceId())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    public BookmarkResponse toBookmarkResponse(Bookmark bookmark) {
        if (bookmark == null) return null;
        return BookmarkResponse.builder()
                .id(bookmark.getId())
                .post(toPostResponse(bookmark.getPost()))
                .savedAt(bookmark.getSavedAt())
                .build();
    }

    public ReportResponse toReportResponse(Report report) {
        if (report == null) return null;
        return ReportResponse.builder()
                .id(report.getId())
                .reporter(toUserResponse(report.getReporter()))
                .postId(report.getPost() != null ? report.getPost().getId() : null)
                .commentId(report.getComment() != null ? report.getComment().getId() : null)
                .reason(report.getReason())
                .description(report.getDescription())
                .status(report.getStatus().name())
                .createdAt(report.getCreatedAt())
                .build();
    }

    public TagResponse toTagResponse(Tag tag) {
        if (tag == null) return null;
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .usageCount(tag.getUsageCount())
                .build();
    }
}