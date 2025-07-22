package com.example.loginapp.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "queries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Query {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "venue_id", nullable = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Venue venue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.PENDING;

    @Column(name = "image_path", length = 500)
    private String imagePath;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "raised_by_user_id", nullable = true)
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private User raisedByUser;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_to_worker_id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private User assignedToWorker;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "completion_notes", columnDefinition = "TEXT")
    private String completionNotes;

    @Column(name = "completion_image_path")
    private String completionImagePath;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "completed_by_user_id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private User completedByUser;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (status == Status.RESOLVED && resolvedAt == null) {
            resolvedAt = LocalDateTime.now();
        }
    }

    public enum Category {
        ELECTRICAL, PLUMBING, CARPENTRY, NETWORK, CLEANING, MAINTENANCE, OTHER
    }

    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }

    public enum Status {
        PENDING, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED
    }
}
