package dev.korol.Expenses.project.repository;

import dev.korol.Expenses.project.entity.Category;
import dev.korol.Expenses.project.entity.Kind;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Korol Artur
 * 29.09.2025
 */

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByKind(Kind kind);

}
