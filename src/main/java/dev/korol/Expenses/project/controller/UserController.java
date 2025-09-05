package dev.korol.Expenses.project.controller;

import dev.korol.Expenses.project.dto.userDTO.UpdateUserRequest;
import dev.korol.Expenses.project.dto.userDTO.UserResponse;
import dev.korol.Expenses.project.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * @author Korol Artur
 * 05.09.2025
 */

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getUser(@AuthenticationPrincipal UserDetails userDetails){
        String email = userDetails.getUsername();

        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateUser(@AuthenticationPrincipal UserDetails userDetails, @Valid @RequestBody UpdateUserRequest updateUserRequest){
        String email = userDetails.getUsername();
        UserResponse userResponse = userService.getUserByEmail(email);

        return ResponseEntity.ok(userService.updateUser(userResponse.getUserId(), updateUserRequest));
    }

}
