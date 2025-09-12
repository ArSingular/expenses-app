package dev.korol.Expenses.project.service;

import dev.korol.Expenses.project.dto.expenseDTO.ExpenseRequest;
import dev.korol.Expenses.project.dto.expenseDTO.ExpenseResponse;
import dev.korol.Expenses.project.dto.expenseDTO.ExpenseUpdateRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author Korol Artur
 * 30.08.2025
 */
@Service
public interface ExpenseService {

    ExpenseResponse createExpense(long userId, ExpenseRequest request);
    ExpenseResponse getExpenseById(long expenseId);
    List<ExpenseResponse> getExpensesByUser(Long userId);
    ExpenseResponse updateExpense(long expenseId,long userId, ExpenseUpdateRequest request);
    void deleteExpense(long expenseId, long userId);
    BigDecimal getTotalByUser(Long userId);

}
