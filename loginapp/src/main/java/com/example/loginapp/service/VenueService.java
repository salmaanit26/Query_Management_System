package com.example.loginapp.service;

import com.example.loginapp.model.Venue;
import com.example.loginapp.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
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

    @PostConstruct
    public void initializeSampleVenues() {
        if (venueRepository.count() == 0) {
            // Create sample venues
            createSampleVenues();
        }
    }

    private void createSampleVenues() {
        List<Venue> sampleVenues = List.of(
            Venue.builder()
                .name("Computer Science Lab A")
                .location("Ground Floor, CS Block")
                .type(Venue.VenueType.LAB)
                .capacity(30)
                .floorNumber(0)
                .building("CS Block")
                .description("State-of-the-art computer laboratory with latest hardware and software for programming and development courses.")
                .imageUrl("https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")
                .build(),
                
            Venue.builder()
                .name("Main Auditorium")
                .location("Central Campus")
                .type(Venue.VenueType.HALL)
                .capacity(500)
                .floorNumber(1)
                .building("Main Building")
                .description("Large auditorium for major events, conferences, and presentations with modern AV equipment.")
                .imageUrl("https://images.unsplash.com/photo-1469827160215-9d29e96e72f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")
                .build(),
                
            Venue.builder()
                .name("Classroom 101")
                .location("First Floor, Academic Block")
                .type(Venue.VenueType.CLASSROOM)
                .capacity(40)
                .floorNumber(1)
                .building("Academic Block")
                .description("Standard classroom equipped with projector and whiteboard for regular lectures.")
                .imageUrl("https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")
                .build(),
                
            Venue.builder()
                .name("Central Library")
                .location("Library Building")
                .type(Venue.VenueType.LIBRARY)
                .capacity(200)
                .floorNumber(0)
                .building("Library Building")
                .description("Multi-floor library with extensive collection of books, journals, and digital resources.")
                .imageUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")
                .build(),
                
            Venue.builder()
                .name("Dean's Office")
                .location("Second Floor, Administration Block")
                .type(Venue.VenueType.OFFICE)
                .capacity(10)
                .floorNumber(2)
                .building("Administration Block")
                .description("Administrative office of the Dean with meeting room facilities.")
                .imageUrl("https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")
                .build(),
                
            Venue.builder()
                .name("Boys Hostel A")
                .location("Hostel Complex")
                .type(Venue.VenueType.HOSTEL)
                .capacity(100)
                .floorNumber(0)
                .building("Hostel Block A")
                .description("Student accommodation facility with modern amenities and 24/7 security.")
                .imageUrl("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")
                .build(),
                
            Venue.builder()
                .name("Chemistry Lab")
                .location("Second Floor, Science Block")
                .type(Venue.VenueType.LAB)
                .capacity(25)
                .floorNumber(2)
                .building("Science Block")
                .description("Well-equipped chemistry laboratory with fume hoods and safety equipment.")
                .imageUrl("https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")
                .build(),
                
            Venue.builder()
                .name("Conference Hall")
                .location("Third Floor, Administration Block")
                .type(Venue.VenueType.HALL)
                .capacity(50)
                .floorNumber(3)
                .building("Administration Block")
                .description("Modern conference facility for meetings, seminars, and workshops.")
                .imageUrl("https://images.unsplash.com/photo-1469827160215-9d29e96e72f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")
                .build()
        );

        venueRepository.saveAll(sampleVenues);
        System.out.println("Initialized " + sampleVenues.size() + " sample venues");
    }
}
