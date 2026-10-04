package com.srujan.querystackk.repository;

import com.srujan.querystackk.entity.Community;
import com.srujan.querystackk.entity.CommunityMember;
import com.srujan.querystackk.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityMemberRepository extends JpaRepository<CommunityMember, Long> {

    Optional<CommunityMember> findByUserAndCommunity(User user, Community community);

    Boolean existsByUserAndCommunity(User user, Community community);

    List<CommunityMember> findByCommunity(Community community);

    List<CommunityMember> findByUser(User user);

    Page<CommunityMember> findByUserOrderByJoinedAtDesc(User user, Pageable pageable);

    Long countByCommunity(Community community);
}