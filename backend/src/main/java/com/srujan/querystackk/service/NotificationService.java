package com.srujan.querystackk.service;

import com.srujan.querystackk.dto.response.NotificationResponse;
import com.srujan.querystackk.dto.response.PageResponse;
import com.srujan.querystackk.entity.Notification;
import com.srujan.querystackk.entity.User;
import com.srujan.querystackk.exception.ResourceNotFoundException;
import com.srujan.querystackk.exception.UnauthorizedException;
import com.srujan.querystackk.mapper.DtoMapper;
import com.srujan.querystackk.repository.NotificationRepository;
import com.srujan.querystackk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final DtoMapper mapper;

    @Transactional
    public void createNotification(Long recipientId, Long actorId,
                                   Notification.NotificationType type,
                                   Long referenceId, String message) {

        // Don't notify yourself
        if (recipientId.equals(actorId)) {
            return;
        }

        User recipient = userRepository.findById(recipientId).orElse(null);
        User actor = userRepository.findById(actorId).orElse(null);

        if (recipient == null || actor == null) {
            return;
        }

        Notification notification = Notification.builder()
                .recipient(recipient)
                .actor(actor)
                .type(type)
                .referenceId(referenceId)
                .message(message)
                .isRead(false)
                .build();

        notificationRepository.save(notification);
    }

    public PageResponse<NotificationResponse> getMyNotifications(String username, int page, int size) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications =
                notificationRepository.findByRecipientOrderByCreatedAtDesc(user, pageable);

        return PageResponse.from(notifications.map(mapper::toNotificationResponse));
    }

    public Long getUnreadCount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }

    @Transactional
    public void markAllAsRead(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        notificationRepository.markAllAsRead(user);
    }

    @Transactional
    public void markAsRead(String username, Long notificationId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getRecipient().getId().equals(user.getId())) {
            throw new UnauthorizedException("You cannot modify this notification");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void deleteNotification(String username, Long notificationId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getRecipient().getId().equals(user.getId())) {
            throw new UnauthorizedException("You cannot delete this notification");
        }

        notificationRepository.delete(notification);
    }

    @Transactional
    public void clearAll(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        notificationRepository.deleteAllByRecipient(user);
    }
}