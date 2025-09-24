package dev.korol.Expenses.project.service;

import dev.korol.Expenses.project.dto.userDTO.*;
import org.springframework.stereotype.Service;

/**
 * @author Korol Artur
 * 30.08.2025
 */

@Service
public interface UserService {

    UserResponse getUserByEmail(String email);
    UserResponse updateUser(Long userId, UpdateUserRequest updateUserRequest);
    String changePassword(Long userId, UpdatePasswordRequest updatePasswordRequest);
    String changeEmail(Long userId, String newEmail);
    ChangeEmailResponse confirmEmailChangeOtp(Long userId, ConfirmEmailOtpRequest confirmEmailOtpRequest);

}
