package dev.korol.Expenses.project.repository;

import dev.korol.Expenses.project.entity.Transaction;
import dev.korol.Expenses.project.entity.TxType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * @author Korol Artur
 * 29.09.2025
 */

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("""
    select t from transactions t
    where t.user.id = :userId
      and (:type is null or t.type = :type)
      and (:from is null or t.date >= :from)
      and (:to is null or t.date <= :to)
    order by t.date desc, t.id desc
  """)
    List<Transaction> findAllByFilters(@Param("userId") long userId,
                                       @Param("type") TxType type,
                                       @Param("from") LocalDate from,
                                       @Param("to") LocalDate to);

    Optional<Transaction> findByIdAndUserId(long id, long userId);

    List<Transaction> findAllByUserId(long userId);

}
