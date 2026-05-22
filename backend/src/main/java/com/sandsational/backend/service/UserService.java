package com.sandsational.backend.service;

import com.sandsational.backend.data.model.User;
import com.sandsational.backend.data.repository.UserRepository;

import com.sandsational.backend.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<User> findAll() { return userRepository.findAll(); }

    @Transactional
    public User createUser(String username, String email, String password) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists.");
        }

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists.");
        }

        String passwordHash = passwordEncoder.encode(password);

        assert passwordHash != null;
        User newUser = new User(email, username, passwordHash);
        return userRepository.save(newUser);
    }

    @Transactional(readOnly = true)
    public User getUser(UUID id){
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Not Found"));
    }

    @Transactional(readOnly = true)
    public List<User> getUsers(){
        return userRepository.findAll();
    }

    public boolean passwordMatches(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }
}
