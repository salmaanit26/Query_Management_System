package com.example.loginapp.repository;

import com.example.loginapp.model.QueryStatusHistory;
import com.example.loginapp.model.Query;
import com.example.loginapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QueryStatusHistoryRepository extends JpaRepository<QueryStatusHistory, Long> {
    
    List<QueryStatusHistory> findByQueryOrderByCreatedAtDesc(Query query);
    
    List<QueryStatusHistory> findByUpdatedByUserOrderByCreatedAtDesc(User user);
    
    List<QueryStatusHistory> findByQueryIdOrderByCreatedAtDesc(Long queryId);
    
    QueryStatusHistory findFirstByQueryOrderByCreatedAtDesc(Query query);
}
