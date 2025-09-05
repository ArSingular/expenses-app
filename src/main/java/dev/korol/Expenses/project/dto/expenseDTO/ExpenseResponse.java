package dev.korol.Expenses.project.dto.expenseDTO;

import dev.korol.Expenses.project.entity.Category;
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
public class ExpenseResponse {

    private long id;
    private BigDecimal amount;
    private Category category;
    private String description;
    private LocalDate date;
    private long userId;

}
