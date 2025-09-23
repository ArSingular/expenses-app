package dev.korol.Expenses.project.exception;

/**
 * @author Korol Artur
 * 20.09.2025
 */
public class WrongPasswordException extends RuntimeException{

    public WrongPasswordException(String message) {
        super(message);
    }
}
