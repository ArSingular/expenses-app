package dev.korol.Expenses.project.repository;

import dev.korol.Expenses.project.entity.Category;
import dev.korol.Expenses.project.entity.Kind;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * @author Korol Artur
 * 29.09.2025
 */

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByKind(Kind kind);
    List<Category> findAllBySystemIsTrueAndKind(Kind kind);
    List<Category> findAllByUserIdAndKind(Long userId, Kind kind);
    Optional<Category> findByIdAndUserId(Long id, Long userId);
    boolean existsByUserIdAndParentIdAndKindAndNameIgnoreCase(long userId, long parentId, Kind kind, String name );

}
