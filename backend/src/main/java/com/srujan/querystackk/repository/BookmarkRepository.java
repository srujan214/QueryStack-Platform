package com.srujan.querystackk.repository;

import com.srujan.querystackk.entity.Bookmark;
import com.srujan.querystackk.entity.Post;
import com.srujan.querystackk.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    Optional<Bookmark> findByUserAndPost(User user, Post post);

    Boolean existsByUserAndPost(User user, Post post);

    Page<Bookmark> findByUserOrderBySavedAtDesc(User user, Pageable pageable);

    Long countByPost(Post post);
}