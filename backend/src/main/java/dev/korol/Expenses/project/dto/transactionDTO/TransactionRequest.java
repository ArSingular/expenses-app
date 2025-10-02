package dev.korol.Expenses.project.dto.transactionDTO;

import dev.korol.Expenses.project.entity.TxType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * @author Korol Artur
 * 29.09.2025
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {

    private TxType type;
    private BigDecimal amount;
    private long categoryId;
    private String description;
    private LocalDate date;

}
