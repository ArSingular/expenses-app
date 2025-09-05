package dev.korol.Expenses.project.service.impl;

import dev.korol.Expenses.project.dto.userDTO.UpdateUserRequest;
import dev.korol.Expenses.project.dto.userDTO.UserResponse;
import dev.korol.Expenses.project.entity.User;
import dev.korol.Expenses.project.exception.EntityNotFoundException;
import dev.korol.Expenses.project.repository.UserRepository;
import dev.korol.Expenses.project.service.UserService;
import dev.korol.Expenses.project.util.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
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

    @Override
    public UserResponse getUserByEmail(String email) {
        return userMapper.toUserResponse(userRepository.findByEmail(email).orElseThrow());
    }

    @Override
    public UserResponse updateUser(Long userId, UpdateUserRequest updateUserRequest) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + userId + " not found"));

        if (!existingUser.getEmail().equalsIgnoreCase(updateUserRequest.getEmail())
                && userRepository.existsByEmail(updateUserRequest.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        userMapper.updateUserFromUpdateRequest(updateUserRequest, existingUser);
        User updatedUser = userRepository.save(existingUser);

        return userMapper.toUserResponse(updatedUser);
    }
}
