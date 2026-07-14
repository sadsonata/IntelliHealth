package com.intellihealth.service;

import com.intellihealth.entity.User;
import com.intellihealth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        if (principal instanceof User) {
            // For JWT authentication, the User object is loaded by ID
            return (User) principal;
        } else if (principal instanceof UserDetails) {
            // For login authentication, UserDetails contains email as username
            String email = ((UserDetails) principal).getUsername();
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        } else {
            // Fallback - try parsing as ID first, then email
            String identifier = principal.toString();
            try {
                Long userId = Long.parseLong(identifier);
                return userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
            } catch (NumberFormatException e) {
                return userRepository.findByEmail(identifier)
                        .orElseThrow(() -> new RuntimeException("User not found with email: " + identifier));
            }
        }
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}
