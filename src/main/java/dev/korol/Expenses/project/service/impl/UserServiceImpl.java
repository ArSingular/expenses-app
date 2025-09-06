package dev.korol.Expenses.project.service.impl;

import dev.korol.Expenses.project.dto.userDTO.UpdateUserRequest;
import dev.korol.Expenses.project.dto.userDTO.UserResponse;
import dev.korol.Expenses.project.entity.User;
import dev.korol.Expenses.project.exception.EntityNotFoundException;
import dev.korol.Expenses.project.repository.UserRepository;
import dev.korol.Expenses.project.service.UserService;
import dev.korol.Expenses.project.util.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * @author Korol Artur
 * 01.09.2025
 */

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse getUserByEmail(String email) {
        return userMapper.toUserResponse(userRepository.findByEmail(email).orElseThrow());
    }

    @Override
    public UserResponse updateUser(Long userId, UpdateUserRequest updateUserRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + userId + " not found"));
        
        if (updateUserRequest.getEmail() != null && !updateUserRequest.getEmail().isEmpty()) {
            if (!updateUserRequest.getEmail().equals(user.getEmail())) {
                userRepository.findByEmail(updateUserRequest.getEmail())
                        .ifPresent(existingUser -> {
                            throw new IllegalArgumentException("Email already in use.");
                        });
            }
        }

        userMapper.updateUserFromUpdateRequest(updateUserRequest, user);

        if (updateUserRequest.getPassword() != null && !updateUserRequest.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(updateUserRequest.getPassword());
            user.setPassword(encodedPassword);
        }

        User updatedUser = userRepository.save(user);

        return userMapper.toUserResponse(updatedUser);
    }
}
