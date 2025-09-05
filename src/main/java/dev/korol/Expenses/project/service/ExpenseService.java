package dev.korol.Expenses.project.service;

import dev.korol.Expenses.project.dto.expenseDTO.ExpenseRequest;
import dev.korol.Expenses.project.dto.expenseDTO.ExpenseResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author Korol Artur
 * 30.08.2025
 */
@Service
public interface ExpenseService {

    ExpenseResponse createExpense(ExpenseRequest request);
    ExpenseResponse getExpenseById(Long expenseId);
    List<ExpenseResponse> getExpensesByUser(Long userId);
    ExpenseResponse updateExpense(Long expenseId, ExpenseRequest request);
    void deleteExpense(Long expenseId);
    BigDecimal getTotalByUser(Long userId);

}
