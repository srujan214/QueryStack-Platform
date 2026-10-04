package com.srujan.querystackk.service;


import com.srujan.querystackk.dto.request.CreateCommentRequest;
import com.srujan.querystackk.dto.response.CommentResponse;
import com.srujan.querystackk.entity.Comment;
import com.srujan.querystackk.entity.Post;
import com.srujan.querystackk.entity.User;
import com.srujan.querystackk.exception.ResourceNotFoundException;
import com.srujan.querystackk.exception.UnauthorizedException;
import com.srujan.querystackk.mapper.DtoMapper;
import com.srujan.querystackk.repository.CommentRepository;
import com.srujan.querystackk.repository.PostRepository;
import com.srujan.querystackk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final DtoMapper mapper;
    private final NotificationService notificationService;

    @Transactional
    public CommentResponse createComment(String username, CreateCommentRequest request) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Comment parent = null;
        if (request.getParentCommentId() != null) {
            parent = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
        }

        Comment comment = Comment.builder()
                .content(request.getContent())
                .author(author)
                .post(post)
                .parentComment(parent)
                .voteCount(0)
                .build();

        comment = commentRepository.save(comment);

        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);

        if (parent != null) {
            notificationService.createNotification(
                    parent.getAuthor().getId(),
                    author.getId(),
                    com.srujan.querystackk.entity.Notification.NotificationType.NEW_REPLY,
                    comment.getId(),
                    author.getUsername() + " replied to your comment"
            );
        } else {
            notificationService.createNotification(
                    post.getAuthor().getId(),
                    author.getId(),
                    com.srujan.querystackk.entity.Notification.NotificationType.NEW_COMMENT,
                    comment.getId(),
                    author.getUsername() + " commented on your post"
            );
        }

        return mapper.toCommentResponse(comment);
    }

    public List<CommentResponse> getCommentsByPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        List<Comment> comments = commentRepository
                .findByPostAndParentCommentIsNullAndDeletedFalseOrderByVoteCountDesc(post);

        return comments.stream()
                .map(mapper::toCommentResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse updateComment(String username, Long commentId, String newContent) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only edit your own comments");
        }

        comment.setContent(newContent);
        commentRepository.save(comment);
        return mapper.toCommentResponse(comment);
    }

    @Transactional
    public void deleteComment(String username, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only delete your own comments");
        }

        comment.setDeleted(true);
        commentRepository.save(comment);

        Post post = comment.getPost();
        post.setCommentCount(Math.max(0, post.getCommentCount() - 1));
        postRepository.save(post);
    }
}
