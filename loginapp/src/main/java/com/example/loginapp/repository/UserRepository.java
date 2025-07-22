package com.example.loginapp.repository;

import com.example.loginapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    List<User> findByRole(User.Role role);
    
    List<User> findByWorkerType(User.WorkerType workerType);
    
    @Query("SELECT u FROM User u WHERE u.role = 'WORKER' AND u.workerType = :workerType")
    List<User> findWorkersByType(@Param("workerType") User.WorkerType workerType);
    
    @Query("SELECT u FROM User u WHERE u.name LIKE %:keyword% OR u.email LIKE %:keyword%")
    List<User> searchUsers(@Param("keyword") String keyword);
    
    boolean existsByEmail(String email);
}
