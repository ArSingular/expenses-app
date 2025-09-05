package dev.korol.Expenses.project.repository;

import dev.korol.Expenses.project.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author Korol Artur
 * 30.08.2025
 */
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserId(Long userId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM expenses e WHERE e.user.id = :userId")
    BigDecimal getTotalByUser(Long userId);

}
