package dev.korol.Expenses.project.dto.userDTO;

import dev.korol.Expenses.project.entity.Role;
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
public class UserResponse {

    private long id;
    private String username;
    private String email;
    private Role role;

}
