package com.elms.user;

import com.elms.exception.ResourceNotFoundException;
import com.elms.user.dto.UserResponse;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public UserResponse getCurrentUser(String email) {
        User user = getUserByEmail(email);
        return UserResponse.fromUser(user);
    }
}
