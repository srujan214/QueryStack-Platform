package com.srujan.querystackk.repository;

import com.srujan.querystackk.entity.Notification;
import com.srujan.querystackk.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByRecipientOrderByCreatedAtDesc(User recipient, Pageable pageable);

    Long countByRecipientAndIsReadFalse(User recipient);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.recipient = :recipient")
    void markAllAsRead(@Param("recipient") User recipient);

    @Modifying
    @Query("DELETE FROM Notification n WHERE n.recipient = :recipient")
    void deleteAllByRecipient(@Param("recipient") User recipient);
}