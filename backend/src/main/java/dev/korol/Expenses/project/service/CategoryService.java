package dev.korol.Expenses.project.service;

import dev.korol.Expenses.project.dto.categoryDTO.CategoryDTO;
import dev.korol.Expenses.project.dto.categoryDTO.CategoryTreeDto;
import dev.korol.Expenses.project.dto.categoryDTO.CreateCategoryRequest;
import dev.korol.Expenses.project.entity.Kind;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Korol Artur
 * 01.10.2025
 */

@Service
public interface CategoryService {

    List<CategoryDTO> listMerged(long userId, Kind kind);
    List<CategoryTreeDto> treeMerged(long userId, Kind kind);
    List<CategoryDTO> listByKind(Kind kind);
    List<CategoryTreeDto> treeByKind(Kind kind);
    CategoryDTO createUserCategory(long userId, CreateCategoryRequest createCategoryRequest);

}
