package com.example.loginapp.repository;

import com.example.loginapp.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {
    
    List<Venue> findByType(Venue.VenueType type);
    
    List<Venue> findByNameContainingIgnoreCase(String name);
    
    List<Venue> findByBuildingIgnoreCase(String building);
    
    @Query("SELECT v FROM Venue v WHERE v.name LIKE %:keyword% OR v.location LIKE %:keyword% OR v.building LIKE %:keyword%")
    List<Venue> searchVenues(@Param("keyword") String keyword);
}
