package dev.korol.Expenses.project.service;

import dev.korol.Expenses.project.dto.userDTO.UserLoginRequest;
import dev.korol.Expenses.project.dto.userDTO.UserRegisterRequest;
import dev.korol.Expenses.project.dto.userDTO.UserResponse;
import org.springframework.stereotype.Service;

/**
 * @author Korol Artur
 * 30.08.2025
 */

@Service
public interface UserService {

    UserResponse getUserById(Long id);
    UserResponse getUserByEmail(String email);

}
