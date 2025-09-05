package dev.korol.Expenses.project.dto.expenseDTO;

import dev.korol.Expenses.project.entity.Category;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * @author Korol Artur
 * 30.08.2025
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseRequest {

    @NotNull
    @Positive
    private BigDecimal amount;

    @NotNull
    private Category category;
    private String description;

    @NotNull
    private LocalDate date;

}
