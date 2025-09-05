package dev.korol.Expenses.project.service.impl;

import dev.korol.Expenses.project.dto.userDTO.UserLoginRequest;
import dev.korol.Expenses.project.dto.userDTO.UserRegisterRequest;
import dev.korol.Expenses.project.dto.userDTO.UserResponse;
import dev.korol.Expenses.project.entity.Role;
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
    public UserResponse getUserById(Long id) {
        return null;
    }

    @Override
    public UserResponse getUserByEmail(String email) {
        return userMapper.toUserResponse(userRepository.findByEmail(email).orElseThrow());
    }
}
