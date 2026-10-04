package com.srujan.querystackk.repository;

import com.srujan.querystackk.entity.Community;
import com.srujan.querystackk.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CommunityRepository extends JpaRepository<Community, Long> {

    Optional<Community> findByName(String name);

    Boolean existsByName(String name);

    List<Community> findByCreatedBy(User user);

    @Query("SELECT c FROM Community c WHERE c.isPrivate = false " +
            "ORDER BY c.memberCount DESC")
    Page<Community> findPopularCommunities(Pageable pageable);

    @Query("SELECT c FROM Community c WHERE " +
            "LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Community> searchCommunities(@Param("keyword") String keyword, Pageable pageable);
}