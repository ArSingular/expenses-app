package dev.korol.Expenses.project.util.mapper;

import dev.korol.Expenses.project.dto.categoryDTO.CategoryDTO;
import dev.korol.Expenses.project.dto.categoryDTO.CategoryTreeDto;
import dev.korol.Expenses.project.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.NullValueMappingStrategy;
import org.springframework.stereotype.Component;

/**
 * @author Korol Artur
 * 01.10.2025
 */

@Mapper(componentModel = "spring", nullValueMapMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
@Component
public interface CategoryMapper {

    Category toCategory(CategoryDTO categoryDTO);
    CategoryDTO toCategoryDTO(Category category);
    CategoryTreeDto toCategoryTreeDTO(Category category);
}
