package com.srujan.querystackk.service;

import com.srujan.querystackk.dto.request.VoteRequest;
import com.srujan.querystackk.dto.response.VoteResponse;
import com.srujan.querystackk.entity.Comment;
import com.srujan.querystackk.entity.Notification;
import com.srujan.querystackk.entity.Post;
import com.srujan.querystackk.entity.User;
import com.srujan.querystackk.entity.Vote;
import com.srujan.querystackk.exception.BadRequestException;
import com.srujan.querystackk.exception.ResourceNotFoundException;
import com.srujan.querystackk.repository.CommentRepository;
import com.srujan.querystackk.repository.PostRepository;
import com.srujan.querystackk.repository.UserRepository;
import com.srujan.querystackk.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteRepository voteRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // ============================================================
    // POST VOTING
    // ============================================================
    @Transactional
    public VoteResponse votePost(String username, VoteRequest request) {

        if (request.getPostId() == null) {
            throw new BadRequestException("Post ID is required");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Vote.VoteType voteType;
        try {
            voteType = Vote.VoteType.valueOf(request.getVoteType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid vote type. Use UPVOTE or DOWNVOTE");
        }

        Optional<Vote> existing = voteRepository.findByUserAndPost(user, post);
        int delta;

        if (existing.isPresent()) {
            Vote vote = existing.get();

            if (vote.getVoteType() == voteType) {
                // Same vote → remove vote (toggle off)
                voteRepository.delete(vote);
                delta = (voteType == Vote.VoteType.UPVOTE) ? -1 : 1;

                post.setVoteCount(post.getVoteCount() + delta);
                postRepository.save(post);

                return VoteResponse.builder()
                        .voteType("REMOVED")
                        .postId(post.getId())
                        .newVoteCount(post.getVoteCount())
                        .build();
            } else {
                // Switch vote (UPVOTE → DOWNVOTE means -2, DOWNVOTE → UPVOTE means +2)
                delta = (voteType == Vote.VoteType.UPVOTE) ? 2 : -2;
                vote.setVoteType(voteType);
                voteRepository.save(vote);
            }
        } else {
            // New vote
            Vote vote = Vote.builder()
                    .user(user)
                    .post(post)
                    .voteType(voteType)
                    .build();
            voteRepository.save(vote);
            delta = (voteType == Vote.VoteType.UPVOTE) ? 1 : -1;
        }

        post.setVoteCount(post.getVoteCount() + delta);
        postRepository.save(post);

        // Update post author's karma
        User author = post.getAuthor();
        if (voteType == Vote.VoteType.UPVOTE) {
            author.setKarmaPoints(author.getKarmaPoints() + 1);

            notificationService.createNotification(
                    author.getId(),
                    user.getId(),
                    Notification.NotificationType.POST_UPVOTE,
                    post.getId(),
                    user.getUsername() + " upvoted your post"
            );
        } else {
            author.setKarmaPoints(author.getKarmaPoints() - 1);
        }
        userRepository.save(author);

        return VoteResponse.builder()
                .voteType(voteType.name())
                .postId(post.getId())
                .newVoteCount(post.getVoteCount())
                .build();
    }

    // ============================================================
    // COMMENT VOTING
    // ============================================================
    @Transactional
    public VoteResponse voteComment(String username, VoteRequest request) {

        if (request.getCommentId() == null) {
            throw new BadRequestException("Comment ID is required");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = commentRepository.findById(request.getCommentId())
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        Vote.VoteType voteType;
        try {
            voteType = Vote.VoteType.valueOf(request.getVoteType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid vote type. Use UPVOTE or DOWNVOTE");
        }

        Optional<Vote> existing = voteRepository.findByUserAndComment(user, comment);
        int delta;

        if (existing.isPresent()) {
            Vote vote = existing.get();

            if (vote.getVoteType() == voteType) {
                // Same vote → remove
                voteRepository.delete(vote);
                delta = (voteType == Vote.VoteType.UPVOTE) ? -1 : 1;

                comment.setVoteCount(comment.getVoteCount() + delta);
                commentRepository.save(comment);

                return VoteResponse.builder()
                        .voteType("REMOVED")
                        .commentId(comment.getId())
                        .newVoteCount(comment.getVoteCount())
                        .build();
            } else {
                // Switch vote
                delta = (voteType == Vote.VoteType.UPVOTE) ? 2 : -2;
                vote.setVoteType(voteType);
                voteRepository.save(vote);
            }
        } else {
            // New vote
            Vote vote = Vote.builder()
                    .user(user)
                    .comment(comment)
                    .voteType(voteType)
                    .build();
            voteRepository.save(vote);
            delta = (voteType == Vote.VoteType.UPVOTE) ? 1 : -1;
        }

        comment.setVoteCount(comment.getVoteCount() + delta);
        commentRepository.save(comment);

        // Update comment author's karma
        User author = comment.getAuthor();
        if (voteType == Vote.VoteType.UPVOTE) {
            author.setKarmaPoints(author.getKarmaPoints() + 1);

            notificationService.createNotification(
                    author.getId(),
                    user.getId(),
                    Notification.NotificationType.COMMENT_UPVOTE,
                    comment.getId(),
                    user.getUsername() + " upvoted your comment"
            );
        } else {
            author.setKarmaPoints(author.getKarmaPoints() - 1);
        }
        userRepository.save(author);

        return VoteResponse.builder()
                .voteType(voteType.name())
                .commentId(comment.getId())
                .newVoteCount(comment.getVoteCount())
                .build();
    }

    // ============================================================
    // HELPERS
    // ============================================================
    public Integer getUserPostVote(String username, Long postId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        return voteRepository.findByUserAndPost(user, post)
                .map(v -> v.getVoteType() == Vote.VoteType.UPVOTE ? 1 : -1)
                .orElse(0);
    }

    public Integer getUserCommentVote(String username, Long commentId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        return voteRepository.findByUserAndComment(user, comment)
                .map(v -> v.getVoteType() == Vote.VoteType.UPVOTE ? 1 : -1)
                .orElse(0);
    }
}