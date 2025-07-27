package com.example.loginapp.controller;

import com.example.loginapp.model.Venue;
import com.example.loginapp.service.VenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/venues")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class VenueController {

    @Autowired
    private VenueService venueService;

    @GetMapping
    public ResponseEntity<List<Venue>> getAllVenues() {
        List<Venue> venues = venueService.getAllVenues();
        return ResponseEntity.ok(venues);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venue> getVenueById(@PathVariable Long id) {
        Optional<Venue> venue = venueService.getVenueById(id);
        return venue.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Venue> createVenue(@RequestBody Venue venue) {
        try {
            Venue savedVenue = venueService.saveVenue(venue);
            return ResponseEntity.ok(savedVenue);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venue> updateVenue(@PathVariable Long id, @RequestBody Venue venue) {
        try {
            venue.setId(id);
            Venue updatedVenue = venueService.saveVenue(venue);
            return ResponseEntity.ok(updatedVenue);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVenue(@PathVariable Long id) {
        try {
            venueService.deleteVenue(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Venue>> getVenuesByType(@PathVariable Venue.VenueType type) {
        List<Venue> venues = venueService.getVenuesByType(type);
        return ResponseEntity.ok(venues);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Venue>> searchVenues(@RequestParam String keyword) {
        List<Venue> venues = venueService.searchVenues(keyword);
        return ResponseEntity.ok(venues);
    }

    @GetMapping("/building/{building}")
    public ResponseEntity<List<Venue>> getVenuesByBuilding(@PathVariable String building) {
        List<Venue> venues = venueService.getVenuesByBuilding(building);
        return ResponseEntity.ok(venues);
    }
}
