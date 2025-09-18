package dev.korol.Expenses.project.controller;

import dev.korol.Expenses.project.dto.userDTO.JwtResponse;
import dev.korol.Expenses.project.dto.userDTO.UserLoginRequest;
import dev.korol.Expenses.project.dto.userDTO.UserRegisterRequest;
import dev.korol.Expenses.project.dto.userDTO.UserResponse;
import dev.korol.Expenses.project.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * @author Korol Artur
 * 30.08.2025
 */

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@Valid @RequestBody UserRegisterRequest userRegisterRequest){

        String message = authService.register(userRegisterRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", message));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> loginUser(@Valid @RequestBody UserLoginRequest userLoginRequest){
        return ResponseEntity.ok(authService.login(userLoginRequest));
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verify(@RequestParam String token) {
        authService.verifyRegistration(token);
        return ResponseEntity.ok("Акаунт успішно верифіковано!");
    }

}
