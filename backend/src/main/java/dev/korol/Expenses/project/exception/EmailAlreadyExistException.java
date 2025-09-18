package dev.korol.Expenses.project.exception;

/**
 * @author Korol Artur
 * 15.09.2025
 */
public class EmailAlreadyExistException extends RuntimeException{

    public EmailAlreadyExistException(String message) {
        super(message);
    }
}
