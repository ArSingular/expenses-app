package dev.korol.Expenses.project.service;

import org.springframework.stereotype.Service;

/**
 * @author Korol Artur
 * 16.09.2025
 */

@Service
public interface EmailService {

    void sendEmail(String to, String subject, String content);

}
