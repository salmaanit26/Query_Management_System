package com.example.loginapp.controller;

import com.example.loginapp.service.PasswordUtilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class PasswordUtilityController {

    @Autowired
    private PasswordUtilityService passwordUtilityService;

    @PostMapping("/convert-passwords")
    public ResponseEntity<String> convertPasswordsToPlainText() {
        try {
            passwordUtilityService.convertAllPasswordsToPlainText();
            return ResponseEntity.ok("All passwords successfully converted to plain text");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error converting passwords: " + e.getMessage());
        }
    }
}
