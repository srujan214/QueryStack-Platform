package com.srujan.querystackk.repository;

import com.srujan.querystackk.entity.Community;
import com.srujan.querystackk.entity.Post;
import com.srujan.querystackk.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByCommunity(Community community, Pageable pageable);

    Page<Post> findByAuthor(User author, Pageable pageable);

    Page<Post> findByDeletedFalse(Pageable pageable);

    Page<Post> findByCommunityAndDeletedFalse(Community community, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.deleted = false " +
            "ORDER BY p.voteCount DESC, p.createdAt DESC")
    Page<Post> findTrendingPosts(Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.deleted = false " +
            "ORDER BY p.createdAt DESC")
    Page<Post> findRecentPosts(Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.deleted = false AND " +
            "(LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Post> searchPosts(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM Post p JOIN p.tags t WHERE t.name = :tagName AND p.deleted = false")
    Page<Post> findByTagName(@Param("tagName") String tagName, Pageable pageable);

    List<Post> findTop10ByCommunityAndDeletedFalseOrderByVoteCountDesc(Community community);
}