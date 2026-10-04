package com.srujan.querystackk.service;


import com.srujan.querystackk.dto.response.BookmarkResponse;
import com.srujan.querystackk.dto.response.PageResponse;
import com.srujan.querystackk.entity.Bookmark;
import com.srujan.querystackk.entity.Post;
import com.srujan.querystackk.entity.User;
import com.srujan.querystackk.exception.BadRequestException;
import com.srujan.querystackk.exception.ResourceNotFoundException;
import com.srujan.querystackk.exception.UnauthorizedException;
import com.srujan.querystackk.mapper.DtoMapper;
import com.srujan.querystackk.repository.BookmarkRepository;
import com.srujan.querystackk.repository.PostRepository;
import com.srujan.querystackk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final DtoMapper mapper;

    @Transactional
    public BookmarkResponse saveBookmark(String username, Long postId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (bookmarkRepository.existsByUserAndPost(user, post)) {
            throw new BadRequestException("Post is already bookmarked");
        }

        Bookmark bookmark = Bookmark.builder()
                .user(user)
                .post(post)
                .build();

        bookmark = bookmarkRepository.save(bookmark);
        return mapper.toBookmarkResponse(bookmark);
    }

    @Transactional
    public void removeBookmark(String username, Long postId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Bookmark bookmark = bookmarkRepository.findByUserAndPost(user, post)
                .orElseThrow(() -> new ResourceNotFoundException("Bookmark not found"));

        bookmarkRepository.delete(bookmark);
    }

    public PageResponse<BookmarkResponse> getMyBookmarks(String username, int page, int size) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(page, size);
        Page<Bookmark> bookmarks = bookmarkRepository.findByUserOrderBySavedAtDesc(user, pageable);

        return PageResponse.from(bookmarks.map(mapper::toBookmarkResponse));
    }

    public Boolean isBookmarked(String username, Long postId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        return bookmarkRepository.existsByUserAndPost(user, post);
    }
}
