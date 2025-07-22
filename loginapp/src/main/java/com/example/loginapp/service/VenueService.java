package com.example.loginapp.service;

import com.example.loginapp.model.Venue;
import com.example.loginapp.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VenueService {

    @Autowired
    private VenueRepository venueRepository;

    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }

    public Optional<Venue> getVenueById(Long id) {
        return venueRepository.findById(id);
    }

    public Venue saveVenue(Venue venue) {
        return venueRepository.save(venue);
    }

    public void deleteVenue(Long id) {
        venueRepository.deleteById(id);
    }

    public List<Venue> getVenuesByType(Venue.VenueType type) {
        return venueRepository.findByType(type);
    }

    public List<Venue> searchVenues(String keyword) {
        return venueRepository.searchVenues(keyword);
    }

    public List<Venue> getVenuesByBuilding(String building) {
        return venueRepository.findByBuildingIgnoreCase(building);
    }
}
