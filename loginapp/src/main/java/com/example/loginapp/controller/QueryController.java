package com.example.loginapp.controller;

import com.example.loginapp.model.Query;
import com.example.loginapp.model.QueryStatusHistory;
import com.example.loginapp.model.User;
import com.example.loginapp.model.Venue;
import com.example.loginapp.service.QueryService;
import com.example.loginapp.service.UserService;
import com.example.loginapp.service.VenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/queries")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class QueryController {

    @Autowired
    private QueryService queryService;

    @Autowired
    private UserService userService;

    @Autowired
    private VenueService venueService;

    @GetMapping
    public ResponseEntity<List<Query>> getAllQueries() {
        List<Query> queries = queryService.getAllQueries();
        return ResponseEntity.ok(queries);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Query> getQueryById(@PathVariable Long id) {
        Optional<Query> query = queryService.getQueryById(id);
        return query.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Query> createQuery(@RequestBody Query query) {
        try {
            Query savedQuery = queryService.saveQuery(query);
            return ResponseEntity.ok(savedQuery);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/anonymous")
    public ResponseEntity<Query> createAnonymousQuery(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("priority") String priority,
            @RequestParam(value = "venueId", required = false) Long venueId,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        
        try {
            // Build Query object for anonymous submission
            Query.QueryBuilder queryBuilder = Query.builder()
                    .title(title)
                    .description(description)
                    .category(Query.Category.valueOf(category.toUpperCase()))
                    .priority(Query.Priority.valueOf(priority.toUpperCase()));

            // Add venue if provided
            if (venueId != null) {
                Optional<Venue> venue = venueService.getVenueById(venueId);
                if (venue.isPresent()) {
                    queryBuilder.venue(venue.get());
                }
            }

            Query query = queryBuilder.build();
            Query savedQuery = queryService.createQuery(query, imageFile);
            return ResponseEntity.ok(savedQuery);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/with-image")
    public ResponseEntity<Query> createQueryWithImage(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "venueId", required = false) Long venueId,
            @RequestParam("category") String category,
            @RequestParam("priority") String priority,
            @RequestParam(value = "raisedByUserId", required = false) Long raisedByUserId,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        
        try {
            // Build Query object with optional user and venue
            Query.QueryBuilder queryBuilder = Query.builder()
                    .title(title)
                    .description(description)
                    .category(Query.Category.valueOf(category.toUpperCase()))
                    .priority(Query.Priority.valueOf(priority.toUpperCase()));

            if (raisedByUserId != null) {
                User raisedByUser = userService.getUserById(raisedByUserId);
                if (raisedByUser != null) {
                    queryBuilder.raisedByUser(raisedByUser);
                }
            }

            if (venueId != null) {
                Optional<Venue> venue = venueService.getVenueById(venueId);
                if (venue.isPresent()) {
                    queryBuilder.venue(venue.get());
                }
            }

            Query query = queryBuilder.build();
            Query savedQuery = queryService.createQuery(query, imageFile);
            return ResponseEntity.ok(savedQuery);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Query>> getQueriesByUser(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        if (user != null) {
            List<Query> queries = queryService.getQueriesByUser(user);
            return ResponseEntity.ok(queries);
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<Query>> getQueriesByWorker(@PathVariable Long workerId) {
        List<Query> queries = queryService.getQueriesByWorker(workerId);
        return ResponseEntity.ok(queries);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Query>> getQueriesByStatus(@PathVariable String status) {
        try {
            Query.Status queryStatus = Query.Status.valueOf(status.toUpperCase());
            List<Query> queries = queryService.getQueriesByStatus(queryStatus);
            return ResponseEntity.ok(queries);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/venue/{venueId}")
    public ResponseEntity<List<Query>> getQueriesByVenue(@PathVariable Long venueId) {
        List<Query> queries = queryService.getQueriesByVenue(venueId);
        return ResponseEntity.ok(queries);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Query>> searchQueries(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Long venueId,
            @RequestParam(required = false) String keyword) {
        
        Query.Status queryStatus = null;
        Query.Category queryCategory = null;
        
        try {
            if (status != null && !status.isEmpty()) {
                queryStatus = Query.Status.valueOf(status.toUpperCase());
            }
            if (category != null && !category.isEmpty()) {
                queryCategory = Query.Category.valueOf(category.toUpperCase());
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }

        List<Query> queries = queryService.searchQueries(queryStatus, queryCategory, venueId, keyword);
        return ResponseEntity.ok(queries);
    }

    @PutMapping("/{id}/assign/{workerId}")
    public ResponseEntity<Query> assignQuery(@PathVariable Long id, @PathVariable Long workerId) {
        try {
            Query updatedQuery = queryService.assignQueryToWorker(id, workerId);
            return ResponseEntity.ok(updatedQuery);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Query> updateQueryStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> statusUpdate) {
        try {
            String statusStr = (String) statusUpdate.get("status");
            Long userId = Long.valueOf(statusUpdate.get("userId").toString());
            String comment = (String) statusUpdate.get("comment");
            
            Query.Status newStatus = Query.Status.valueOf(statusStr);
            Query updatedQuery = queryService.updateQueryStatusWithHistory(id, newStatus, userId, comment);
            return ResponseEntity.ok(updatedQuery);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Query> completeQuery(
            @PathVariable Long id,
            @RequestParam(value = "userId") Long userId,
            @RequestParam(value = "completionNotes", required = false) String completionNotes,
            @RequestParam(value = "completionImage", required = false) MultipartFile completionImage) {
        try {
            Query completedQuery = queryService.completeQueryWithHistory(id, userId, completionNotes, completionImage);
            return ResponseEntity.ok(completedQuery);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuery(@PathVariable Long id) {
        try {
            queryService.deleteQuery(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getQueryStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalQueries", queryService.getAllQueries().size());
        stats.put("pendingQueries", queryService.getQueryCountByStatus(Query.Status.PENDING));
        stats.put("assignedQueries", queryService.getQueryCountByStatus(Query.Status.ASSIGNED));
        stats.put("inProgressQueries", queryService.getQueryCountByStatus(Query.Status.IN_PROGRESS));
        stats.put("resolvedQueries", queryService.getQueryCountByStatus(Query.Status.RESOLVED));
        stats.put("closedQueries", queryService.getQueryCountByStatus(Query.Status.CLOSED));
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<Query> assignWorker(@PathVariable Long id, @RequestBody Map<String, Long> request) {
        try {
            Long workerId = request.get("workerId");
            Query updatedQuery = queryService.assignWorker(id, workerId);
            if (updatedQuery != null) {
                return ResponseEntity.ok(updatedQuery);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<QueryStatusHistory>> getQueryStatusHistory(@PathVariable Long id) {
        List<QueryStatusHistory> history = queryService.getQueryStatusHistory(id);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/{id}/completion-test")
    public ResponseEntity<Map<String, Object>> getCompletionTest(@PathVariable Long id) {
        Optional<Query> queryOpt = queryService.getQueryById(id);
        Map<String, Object> response = new HashMap<>();
        
        if (queryOpt.isPresent()) {
            Query query = queryOpt.get();
            response.put("id", query.getId());
            response.put("status", query.getStatus());
            response.put("completionNotes", query.getCompletionNotes());
            response.put("completionImagePath", query.getCompletionImagePath());
            response.put("completedByUser", query.getCompletedByUser());
            response.put("resolvedAt", query.getResolvedAt());
        } else {
            response.put("error", "Query not found");
        }
        
        return ResponseEntity.ok(response);
    }

    // Test endpoint to verify completion data storage
    @PostMapping("/test-completion")
    public ResponseEntity<Map<String, Object>> testCompletion() {
        Map<String, Object> response = new HashMap<>();
        try {
            // Create a test query if none exists
            Query testQuery = Query.builder()
                .title("Test Completion Query")
                .description("Testing completion functionality")
                .category(Query.Category.OTHER)
                .priority(Query.Priority.MEDIUM)
                .status(Query.Status.ASSIGNED)
                .build();
            
            // Find a worker user (first worker in database)
            List<User> workers = userService.getWorkers();
            if (!workers.isEmpty()) {
                User worker = workers.get(0);
                testQuery.setAssignedToWorker(worker);
                Query savedQuery = queryService.saveQuery(testQuery);
                
                // Now complete it
                String testNotes = "Test completion notes - work completed successfully";
                Query completedQuery = queryService.completeQueryWithHistory(
                    savedQuery.getId(), 
                    worker.getId(), 
                    testNotes, 
                    null
                );
                
                response.put("success", true);
                response.put("message", "Test completion successful");
                response.put("queryId", completedQuery.getId());
                response.put("completionNotes", completedQuery.getCompletionNotes());
                response.put("completedBy", completedQuery.getCompletedByUser().getName());
                response.put("status", completedQuery.getStatus().toString());
                
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "No workers found in database");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(response);
        }
    }
}
