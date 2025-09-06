package dev.korol.Expenses.project.util.mapper;

import dev.korol.Expenses.project.dto.expenseDTO.ExpenseRequest;
import dev.korol.Expenses.project.dto.expenseDTO.ExpenseResponse;
import dev.korol.Expenses.project.dto.expenseDTO.ExpenseUpdateRequest;
import dev.korol.Expenses.project.entity.Expense;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

/**
 * @author Korol Artur
 * 01.09.2025
 */

@Mapper(componentModel = "spring", nullValueMapMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
@Component
public interface ExpenseMapper {

    ExpenseResponse toExpenseResponse(ExpenseRequest expenseRequest);

    @Mapping(source = "user.id", target = "userId")
    ExpenseResponse toExpenseResponse(Expense expense);
    ExpenseRequest toExpenseRequest(ExpenseResponse expenseResponse);
    ExpenseRequest toExpenseRequest(Expense expense);
    Expense toExpense(ExpenseRequest expenseRequest);
    Expense toExpense(ExpenseResponse expenseResponse);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateExpenseFromExpenseUpdateRequest(ExpenseUpdateRequest expenseUpdateRequest, @MappingTarget Expense expense);
}
