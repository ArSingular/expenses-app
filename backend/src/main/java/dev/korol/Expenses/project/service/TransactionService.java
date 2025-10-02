package dev.korol.Expenses.project.service;

import dev.korol.Expenses.project.dto.transactionDTO.TransactionRequest;
import dev.korol.Expenses.project.dto.transactionDTO.TransactionResponse;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Korol Artur
 * 29.09.2025
 */

@Service
public interface TransactionService {

    List<TransactionResponse> findAllByUserId(long userId);
    TransactionResponse createTransaction(long userId, TransactionRequest transactionRequest);
    TransactionResponse updateTransaction(long transactionId, long userId, TransactionRequest transactionRequest);
    void deleteTransaction(long transactionId, long userId);

}
