package com.srujan.querystackk.repository;

import com.srujan.querystackk.entity.Comment;
import com.srujan.querystackk.entity.Post;
import com.srujan.querystackk.entity.User;
import com.srujan.querystackk.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    Optional<Vote> findByUserAndPost(User user, Post post);

    Optional<Vote> findByUserAndComment(User user, Comment comment);

    Boolean existsByUserAndPost(User user, Post post);

    Boolean existsByUserAndComment(User user, Comment comment);

    @Query("SELECT COUNT(v) FROM Vote v WHERE v.post = :post AND v.voteType = 'UPVOTE'")
    Long countUpvotesByPost(@Param("post") Post post);

    @Query("SELECT COUNT(v) FROM Vote v WHERE v.post = :post AND v.voteType = 'DOWNVOTE'")
    Long countDownvotesByPost(@Param("post") Post post);

    @Query("SELECT COUNT(v) FROM Vote v WHERE v.comment = :comment AND v.voteType = 'UPVOTE'")
    Long countUpvotesByComment(@Param("comment") Comment comment);

    @Query("SELECT COUNT(v) FROM Vote v WHERE v.comment = :comment AND v.voteType = 'DOWNVOTE'")
    Long countDownvotesByComment(@Param("comment") Comment comment);
}