package dev.korol.Expenses.project.service.impl;

import dev.korol.Expenses.project.dto.userDTO.*;
import dev.korol.Expenses.project.entity.User;
import dev.korol.Expenses.project.exception.EmailAlreadyExistException;
import dev.korol.Expenses.project.exception.EntityNotFoundException;
import dev.korol.Expenses.project.exception.VerificationException;
import dev.korol.Expenses.project.exception.WrongPasswordException;
import dev.korol.Expenses.project.repository.UserRepository;
import dev.korol.Expenses.project.security.JwtUtil;
import dev.korol.Expenses.project.security.service.CustomUserDetailsService;
import dev.korol.Expenses.project.service.EmailService;
import dev.korol.Expenses.project.service.UserService;
import dev.korol.Expenses.project.util.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * @author Korol Artur
 * 01.09.2025
 */

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {
        return userMapper.toUserResponse(userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("User with email %s not found".formatted(email))));
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long userId, UpdateUserRequest updateUserRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + userId + " not found"));
        
        if (updateUserRequest.getEmail() != null && !updateUserRequest.getEmail().isEmpty()) {
            if (!updateUserRequest.getEmail().equals(user.getEmail())) {
                userRepository.findByEmail(updateUserRequest.getEmail())
                        .ifPresent(existingUser -> {
                            throw new EmailAlreadyExistException("Ой, а така пошта вже існує, оновити не вийде");
                        });
            }
        }

        userMapper.updateUserFromUpdateRequest(updateUserRequest, user);

        User updatedUser = userRepository.save(user);

        return userMapper.toUserResponse(updatedUser);
    }

    @Override
    @Transactional
    public String changeEmail(Long userId, String newEmail){
        if(newEmail == null || newEmail.isBlank()){
            throw new IllegalArgumentException("Нова пошта не задана");
        }

        userRepository.findByEmail(newEmail)
                .ifPresent(existingUser -> {
                    throw new EmailAlreadyExistException("Ой, а така пошта вже існує, оновити не вийде");
                });

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + userId + " not found"));

        String otp = genOtp6();
        user.setPendingEmail(newEmail);
        user.setVerificationToken(otp);
        user.setChangeEmailTokenExpiry(Instant.now().plus(10, ChronoUnit.MINUTES));
        userRepository.save(user);

        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    emailService.sendEmail(newEmail, "Підтвердження зміни пошти",
                            "\nТвій код підтвердження: " + otp + ". \nДійсний 10 хв.");
                }
            });
        } else {
            emailService.sendEmail(newEmail, "Підтвердження зміни пошти",
                    "\nТвій код підтвердження: " + otp + ". \nДійсний 10 хв.");
        }

        return "Код підтвердження відправлено на нову пошту!";
    }


    @Override
    @Transactional
    public ChangeEmailResponse confirmEmailChangeOtp(Long userId, ConfirmEmailOtpRequest confirmEmailOtpRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + userId + " not found" ));

        if(user.getPendingEmail() == null || !user.getPendingEmail().equalsIgnoreCase(confirmEmailOtpRequest.getNewEmail())){
            throw new EntityNotFoundException("Невірна або відсутня цільова пошта");
        }

        if(user.getChangeEmailTokenExpiry() == null || Instant.now().isAfter(user.getChangeEmailTokenExpiry())){
            throw new VerificationException("Код прострочений");
        }

        if(user.getVerificationToken() == null || !user.getVerificationToken().equals(confirmEmailOtpRequest.getOtp())){
            throw new VerificationException("Невірний код");
        }

        user.setEmail(confirmEmailOtpRequest.getNewEmail());
        user.setPendingEmail(null);
        user.setVerificationToken(null);
        user.setChangeEmailTokenExpiry(null);
        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String newToken = jwtUtil.generateToken(userDetails);


        return new ChangeEmailResponse("Пошту успішно змінено", newToken);
    }


    @Override
    @Transactional
    public String changePassword(Long userId, UpdatePasswordRequest updatePasswordRequest){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + userId + " not found"));

        if(!passwordEncoder.matches(updatePasswordRequest.getOldPassword(), user.getPassword())){
            throw new WrongPasswordException("Нажаль старий пароль неправильний, спробуйте ще раз");
        }
        user.setPassword(passwordEncoder.encode(updatePasswordRequest.getNewPassword()));
         userRepository.saveAndFlush(user);

         return "Пароль успішно змінено";
    }

    private String genOtp6(){
        SecureRandom sr = new SecureRandom();
        return String.format("%06d", sr.nextInt(1_000_000));
    }
}
