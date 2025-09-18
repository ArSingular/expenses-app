package dev.korol.Expenses.project.repository;

import dev.korol.Expenses.project.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * @author Korol Artur
 * 30.08.2025
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User>findByVerificationToken(String verificationToken);
    Optional<User>findByResetPasswordToken(String resetPasswordToken);

}
