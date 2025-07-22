package com.example.loginapp.repository;

import com.example.loginapp.model.Query;
import com.example.loginapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QueryRepository extends JpaRepository<Query, Long> {
    
    List<Query> findByRaisedByUser(User user);
    
    List<Query> findByAssignedToWorker(User worker);
    
    List<Query> findByAssignedToWorkerOrderByCreatedAtDesc(User worker);
    
    List<Query> findByStatus(Query.Status status);
    
    List<Query> findByCategory(Query.Category category);
    
    List<Query> findByPriority(Query.Priority priority);
    
    List<Query> findByVenueId(Long venueId);
    
    List<Query> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    @org.springframework.data.jpa.repository.Query("SELECT q FROM Query q WHERE " +
            "(:status IS NULL OR q.status = :status) AND " +
            "(:category IS NULL OR q.category = :category) AND " +
            "(:venueId IS NULL OR q.venue.id = :venueId) AND " +
            "(q.title LIKE %:keyword% OR q.description LIKE %:keyword%)")
    List<Query> findWithFilters(@Param("status") Query.Status status,
                               @Param("category") Query.Category category,
                               @Param("venueId") Long venueId,
                               @Param("keyword") String keyword);
    
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(q) FROM Query q WHERE q.status = :status")
    Long countByStatus(@Param("status") Query.Status status);
    
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(q) FROM Query q WHERE q.raisedByUser = :user")
    Long countByUser(@Param("user") User user);
}
