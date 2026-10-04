package com.srujan.querystackk.service;


import com.srujan.querystackk.dto.request.CreateCommunityRequest;
import com.srujan.querystackk.dto.response.CommunityResponse;
import com.srujan.querystackk.dto.response.PageResponse;
import com.srujan.querystackk.entity.Community;
import com.srujan.querystackk.entity.CommunityMember;
import com.srujan.querystackk.entity.User;
import com.srujan.querystackk.exception.BadRequestException;
import com.srujan.querystackk.exception.DuplicateResourceException;
import com.srujan.querystackk.exception.ResourceNotFoundException;
import com.srujan.querystackk.exception.UnauthorizedException;
import com.srujan.querystackk.mapper.DtoMapper;
import com.srujan.querystackk.repository.CommunityMemberRepository;
import com.srujan.querystackk.repository.CommunityRepository;
import com.srujan.querystackk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final DtoMapper mapper;

    @Transactional
    public CommunityResponse createCommunity(String username, CreateCommunityRequest request) {
        if (communityRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Community name already exists");
        }

        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Community community = Community.builder()
                .name(request.getName())
                .description(request.getDescription())
                .bannerUrl(request.getBannerUrl())
                .iconUrl(request.getIconUrl())
                .isPrivate(request.getIsPrivate() != null ? request.getIsPrivate() : false)
                .createdBy(creator)
                .memberCount(1)
                .build();

        community = communityRepository.save(community);

        CommunityMember owner = CommunityMember.builder()
                .user(creator)
                .community(community)
                .role(CommunityMember.MemberRole.OWNER)
                .build();
        memberRepository.save(owner);

        return mapper.toCommunityResponse(community);
    }

    public CommunityResponse getCommunityById(Long id) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));
        return mapper.toCommunityResponse(community);
    }

    public CommunityResponse getCommunityByName(String name) {
        Community community = communityRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found: " + name));
        return mapper.toCommunityResponse(community);
    }

    public PageResponse<CommunityResponse> getAllCommunities(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Community> communities = communityRepository.findPopularCommunities(pageable);
        return PageResponse.from(communities.map(mapper::toCommunityResponse));
    }

    public PageResponse<CommunityResponse> searchCommunities(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Community> communities = communityRepository.searchCommunities(keyword, pageable);
        return PageResponse.from(communities.map(mapper::toCommunityResponse));
    }

    @Transactional
    public void joinCommunity(String username, Long communityId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));

        if (memberRepository.existsByUserAndCommunity(user, community)) {
            throw new BadRequestException("Already a member");
        }

        CommunityMember member = CommunityMember.builder()
                .user(user)
                .community(community)
                .role(CommunityMember.MemberRole.MEMBER)
                .build();
        memberRepository.save(member);

        community.setMemberCount(community.getMemberCount() + 1);
        communityRepository.save(community);
    }

    @Transactional
    public void leaveCommunity(String username, Long communityId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));

        CommunityMember member = memberRepository.findByUserAndCommunity(user, community)
                .orElseThrow(() -> new BadRequestException("Not a member"));

        if (member.getRole() == CommunityMember.MemberRole.OWNER) {
            throw new BadRequestException("Owner cannot leave the community. Transfer ownership first.");
        }

        memberRepository.delete(member);
        community.setMemberCount(Math.max(0, community.getMemberCount() - 1));
        communityRepository.save(community);
    }

    public List<CommunityResponse> getMyCommunities(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return memberRepository.findByUser(user).stream()
                .map(m -> mapper.toCommunityResponse(m.getCommunity()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteCommunity(String username, Long communityId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));

        if (!community.getCreatedBy().getId().equals(user.getId())) {
            throw new UnauthorizedException("Only the creator can delete this community");
        }

        communityRepository.delete(community);
    }
}