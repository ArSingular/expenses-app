package dev.korol.Expenses.project.service.impl;

import dev.korol.Expenses.project.dto.userDTO.JwtResponse;
import dev.korol.Expenses.project.dto.userDTO.UserLoginRequest;
import dev.korol.Expenses.project.dto.userDTO.UserRegisterRequest;
import dev.korol.Expenses.project.entity.Role;
import dev.korol.Expenses.project.entity.User;
import dev.korol.Expenses.project.exception.EmailAlreadyExistException;
import dev.korol.Expenses.project.exception.EntityNotFoundException;
import dev.korol.Expenses.project.exception.UserNotVerifiedException;
import dev.korol.Expenses.project.repository.UserRepository;
import dev.korol.Expenses.project.security.JwtUtil;
import dev.korol.Expenses.project.service.AuthService;
import dev.korol.Expenses.project.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * @author Korol Artur
 * 04.09.2025
 */

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    @Override
    public String register(UserRegisterRequest request) {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new EmailAlreadyExistException("Ой, а така пошта вже існує, спробуй іншу");
        }

        String verificationToken = UUID.randomUUID().toString();


        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .enabled(false)
                .verificationToken(verificationToken)
                .build();

        User saved = userRepository.save(user);

        String link = "http://localhost:4200/verify?token=" + verificationToken;
        emailService.sendEmail(
                saved.getEmail(),
                "Верифікація акаунту",
                "Привіт, " + saved.getUsername() + "!\n\nБудь ласка верифікуй акаунт тицьнувши на посиланння нижче:\n" + link
        );


        return "Реєстрація пройшла успішно!" +
                "\nПеревір пошту для верифікації акаунту";
    }

    @Override
    public JwtResponse login(UserLoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("Користувача з поштою: " + request.getEmail() + " не було знайдено"));

        if(!user.isEnabled()){
            throw new UserNotVerifiedException("Користувач з поштою: " + request.getEmail() + " не верифікований." +
                    "\n Будь ласка перевірте ваші вхідні/спам повідомлення на пошті.");
        }

        return new JwtResponse(token);
//        return new JwtResponse(token,new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole()));
    }

    @Override
    public void verifyRegistration(String verificationToken) {
        User user = userRepository.findByVerificationToken(verificationToken)
                .orElseThrow(() -> new EntityNotFoundException("Уупс, цей токен недійсний"));
        user.setEnabled(true);
        user.setVerificationToken(null);
        userRepository.save(user);
    }


}
