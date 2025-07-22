package com.example.loginapp.model;

import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "query_status_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueryStatusHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "query_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Query query;

    @Enumerated(EnumType.STRING)
    @Column(name = "old_status")
    private Query.Status oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false)
    private Query.Status newStatus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "updated_by_user_id", nullable = false)
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private User updatedByUser;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "completion_image_path")
    private String completionImagePath;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
