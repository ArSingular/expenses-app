package dev.korol.Expenses.project.exception;

/**
 * @author Korol Artur
 * 01.09.2025
 */
public class EntityNotFoundException extends RuntimeException{

    public EntityNotFoundException(String message) {
        super(message);
    }
}
