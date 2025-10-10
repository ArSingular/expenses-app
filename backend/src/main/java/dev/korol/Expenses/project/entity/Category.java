package dev.korol.Expenses.project.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Korol Artur
 * 29.09.2025
 */


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity(name = "categories")
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"name", "kind"}))
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Kind kind;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
    private List<Category> children = new ArrayList<>();

    @Column(name = "is_system", nullable = false)
    private boolean system = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

//    private String iconClass;
//    private String iconColor;
//    private String iconBgColor;

}
