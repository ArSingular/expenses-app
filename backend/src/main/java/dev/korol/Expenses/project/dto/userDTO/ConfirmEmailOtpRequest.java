package dev.korol.Expenses.project.dto.userDTO;

import lombok.*;

/**
 * @author Korol Artur
 * 22.09.2025
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConfirmEmailOtpRequest {

    private String newEmail;
    private String otp;

}
