package dev.korol.Expenses.project.dto.userDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author Korol Artur
 * 23.09.2025
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangeEmailResponse {

    private String message;
    private String token;

}
