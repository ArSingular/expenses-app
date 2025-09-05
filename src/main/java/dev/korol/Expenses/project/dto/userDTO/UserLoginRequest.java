package dev.korol.Expenses.project.dto.userDTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author Korol Artur
 * 30.08.2025
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

}
