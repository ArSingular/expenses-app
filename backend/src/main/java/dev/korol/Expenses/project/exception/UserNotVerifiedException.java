package dev.korol.Expenses.project.exception;

/**
 * @author Korol Artur
 * 18.09.2025
 */
public class UserNotVerifiedException extends RuntimeException{

    public UserNotVerifiedException(String message) {
        super(message);
    }
}
