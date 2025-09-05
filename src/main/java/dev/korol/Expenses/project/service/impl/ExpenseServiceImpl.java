package dev.korol.Expenses.project.service.impl;

import dev.korol.Expenses.project.dto.expenseDTO.ExpenseRequest;
import dev.korol.Expenses.project.dto.expenseDTO.ExpenseResponse;
import dev.korol.Expenses.project.entity.Expense;
import dev.korol.Expenses.project.entity.User;
import dev.korol.Expenses.project.exception.EntityNotFoundException;
import dev.korol.Expenses.project.repository.ExpenseRepository;
import dev.korol.Expenses.project.repository.UserRepository;
import dev.korol.Expenses.project.service.ExpenseService;
import dev.korol.Expenses.project.util.mapper.ExpenseMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author Korol Artur
 * 01.09.2025
 */

@Service
@RequiredArgsConstructor
@Transactional
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;
    private final UserRepository userRepository;


    @Override
    public ExpenseResponse createExpense(long userId, ExpenseRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + userId + " not found "));

        Expense expense = expenseMapper.toExpense(request);
        expense.setUser(user);

        Expense saved = expenseRepository.save(expense);

        return expenseMapper.toExpenseResponse(saved);
    }

    @Override
    public ExpenseResponse getExpenseById(long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new EntityNotFoundException("Expense with id: " + expenseId + " not found"));

        return expenseMapper.toExpenseResponse(expense);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByUser(Long userId) {
        List<Expense> expenseResponses = expenseRepository.findByUserId(userId);

        return expenseResponses.stream().map(expenseMapper::toExpenseResponse).collect(Collectors.toList());
    }

    @Override
    public ExpenseResponse updateExpense(long expenseId,long userId, ExpenseRequest request) {
        Expense existedExpense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new EntityNotFoundException("Expense with id: " + expenseId + " not found "));

        long existedUserId = existedExpense.getUser().getId();

        if (existedUserId != userId) {
            throw new AccessDeniedException("No access to update this expense");
        }

        expenseMapper.updateExpenseFromExpenseRequest(request, existedExpense);
        Expense updated = expenseRepository.save(existedExpense);

        return expenseMapper.toExpenseResponse(updated);
    }

    @Override
    public void deleteExpense(long expenseId, long userId) {
        Expense existedExpense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new EntityNotFoundException("Expense with id: " + expenseId + " not found "));

        long existedUserId = existedExpense.getUser().getId();

        if (existedUserId != userId) {
            throw new AccessDeniedException("No access to delete this expense");
        }

        expenseRepository.deleteById(expenseId);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getTotalByUser(Long userId) {
        return expenseRepository.getTotalByUser(userId);
    }
}
