package com.srujan.querystackk.repository;

import com.srujan.querystackk.entity.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {

    Optional<Tag> findByName(String name);

    Boolean existsByName(String name);

    @Query("SELECT t FROM Tag t ORDER BY t.usageCount DESC")
    Page<Tag> findPopularTags(Pageable pageable);

    @Query("SELECT t FROM Tag t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Tag> searchTags(@Param("keyword") String keyword);
}