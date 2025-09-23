package dev.korol.Expenses.project.dto.userDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author Korol Artur
 * 20.09.2025
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePasswordRequest {

    private String oldPassword;

    @NotBlank
    @Size(min = 6, message = "Пароль має містити мінімум 6 символів")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\\-=]).{6,}$",
            message = "Пароль повинен містити літери, цифри та спеціальний символ"
    )
    private String newPassword;

}
