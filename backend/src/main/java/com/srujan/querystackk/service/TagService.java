package com.srujan.querystackk.service;


import com.srujan.querystackk.dto.response.PageResponse;
import com.srujan.querystackk.dto.response.TagResponse;
import com.srujan.querystackk.entity.Tag;
import com.srujan.querystackk.exception.ResourceNotFoundException;
import com.srujan.querystackk.mapper.DtoMapper;
import com.srujan.querystackk.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    private final DtoMapper mapper;

    public PageResponse<TagResponse> getPopularTags(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Tag> tags = tagRepository.findPopularTags(pageable);
        return PageResponse.from(tags.map(mapper::toTagResponse));
    }

    public List<TagResponse> searchTags(String keyword) {
        return tagRepository.searchTags(keyword).stream()
                .map(mapper::toTagResponse)
                .collect(Collectors.toList());
    }

    public TagResponse getTagByName(String name) {
        Tag tag = tagRepository.findByName(name.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found: " + name));
        return mapper.toTagResponse(tag);
    }

    public TagResponse createTag(String name) {
        String cleanName = name.trim().toLowerCase();

        Tag tag = tagRepository.findByName(cleanName)
                .orElseGet(() -> tagRepository.save(
                        Tag.builder().name(cleanName).usageCount(0).build()));

        return mapper.toTagResponse(tag);
    }
}