package dev.korol.Expenses.project.service;

import dev.korol.Expenses.project.dto.userDTO.JwtResponse;
import dev.korol.Expenses.project.dto.userDTO.UserLoginRequest;
import dev.korol.Expenses.project.dto.userDTO.UserRegisterRequest;
import dev.korol.Expenses.project.dto.userDTO.UserResponse;
import org.springframework.stereotype.Service;

/**
 * @author Korol Artur
 * 04.09.2025
 */

@Service
public interface AuthService {

    UserResponse register(UserRegisterRequest request);
    JwtResponse login(UserLoginRequest request);

}
