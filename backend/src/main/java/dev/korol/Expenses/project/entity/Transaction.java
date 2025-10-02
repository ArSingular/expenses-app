package dev.korol.Expenses.project.entity;

import jakarta.persistence.*;
import lombok.*;

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
@Data
@Entity(name = "transactions")
@Table(indexes = {
        @Index(columnList = "user_id,date"),
        @Index(columnList = "type"),
        @Index(columnList = "category_id")
})
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TxType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal amount;

    @Column(length = 510)
    private String description;

    @Column(nullable = false)
    private LocalDate date;

}
