package dev.korol.Expenses.project.service.impl;

import dev.korol.Expenses.project.dto.transactionDTO.TransactionRequest;
import dev.korol.Expenses.project.dto.transactionDTO.TransactionResponse;
import dev.korol.Expenses.project.entity.*;
import dev.korol.Expenses.project.exception.EntityNotFoundException;
import dev.korol.Expenses.project.repository.CategoryRepository;
import dev.korol.Expenses.project.repository.TransactionRepository;
import dev.korol.Expenses.project.repository.UserRepository;
import dev.korol.Expenses.project.service.TransactionService;
import dev.korol.Expenses.project.util.mapper.TransactionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author Korol Artur
 * 29.09.2025
 */

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public List<TransactionResponse> findAllByUserId(long userId) {
        return transactionRepository.findAllByUserId(userId).stream().map(transactionMapper::toTransactionResponse).toList();
    }

    @Override
    public TransactionResponse createTransaction(long userId, TransactionRequest transactionRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + userId + " not found "));

        Category category = categoryRepository.findById(transactionRequest.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category with id: " + transactionRequest.getCategoryId() + " not found "));

        if(!match(transactionRequest.getType(), category.getKind())){
            throw new IllegalArgumentException("Тип категорії повинен співпадати з типом транзакції");
        }

        Transaction transaction = transactionMapper.toTransaction(transactionRequest);
        transaction.setUser(user);
        transaction.setCategory(category);

        return transactionMapper.toTransactionResponse(transactionRepository.save(transaction));
    }

    @Override
    @Transactional
    public TransactionResponse updateTransaction(long transactionId, long userId, TransactionRequest transactionRequest) {
        Transaction existedTransaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new EntityNotFoundException("Transaction with id: " + transactionId + " not found "));

        long existedUserId = existedTransaction.getUser().getId();

        if(existedUserId != userId){
            throw new AccessDeniedException("Немає доступу щоб оновити транзакцію");
        }

        if(transactionRequest.getCategoryId() != 0){
            Category category = categoryRepository.findById(transactionRequest.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category with id: " + transactionRequest.getCategoryId() + " not found "));

            existedTransaction.setCategory(category);
        }

        transactionMapper.updateTransactionFromTransactionRequest(transactionRequest, existedTransaction);

        Transaction updated = transactionRepository.save(existedTransaction);

        return transactionMapper.toTransactionResponse(updated);
    }

    @Override
    @Transactional
    public void deleteTransaction(long transactionId, long userId) {
        Transaction existedTransaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new EntityNotFoundException("Transaction with id: " + transactionId + " not found "));

        long existedUserId = existedTransaction.getUser().getId();

        if (existedUserId != userId) {
            throw new AccessDeniedException("Немає доступу щоб видалити транзакцію");
        }

        transactionRepository.delete(existedTransaction);
    }

    private boolean match(TxType type, Kind kind){
        return (type == TxType.INCOME && kind == Kind.INCOME) || (type == TxType.EXPENSE && kind == Kind.EXPENSE);
    }
}
