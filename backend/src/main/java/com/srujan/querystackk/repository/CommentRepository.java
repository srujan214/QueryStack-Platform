package com.srujan.querystackk.repository;

import com.srujan.querystackk.entity.Comment;
import com.srujan.querystackk.entity.Post;
import com.srujan.querystackk.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostAndParentCommentIsNullAndDeletedFalseOrderByVoteCountDesc(Post post);

    Page<Comment> findByAuthor(User author, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.post = :post AND c.deleted = false " +
            "ORDER BY c.createdAt DESC")
    Page<Comment> findByPostOrderByCreatedAtDesc(@Param("post") Post post, Pageable pageable);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post = :post AND c.deleted = false")
    Long countByPost(@Param("post") Post post);

    List<Comment> findByParentComment(Comment parentComment);
}