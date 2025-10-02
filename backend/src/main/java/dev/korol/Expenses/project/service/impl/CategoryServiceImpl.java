package dev.korol.Expenses.project.service.impl;

import dev.korol.Expenses.project.dto.categoryDTO.CategoryDTO;
import dev.korol.Expenses.project.dto.categoryDTO.CategoryTreeDto;
import dev.korol.Expenses.project.entity.Category;
import dev.korol.Expenses.project.entity.Kind;
import dev.korol.Expenses.project.repository.CategoryRepository;
import dev.korol.Expenses.project.service.CategoryService;
import dev.korol.Expenses.project.util.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * @author Korol Artur
 * 01.10.2025
 */

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> listByKind(Kind kind) {
        List<Category> categories = categoryRepository.findByKind(kind);

        return categories.stream().map(categoryMapper::toCategoryDTO).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryTreeDto> treeByKind(Kind kind) {

        List<Category> categories = categoryRepository.findByKind(kind);

        Map<Long, CategoryTreeDto> categoryTreeDtoMap = new HashMap<>();

        for(Category c : categories){
            categoryTreeDtoMap.put(c.getId(), new CategoryTreeDto(c.getId(), c.getName(), c.getKind(), new ArrayList<>()));
        }

        List<CategoryTreeDto> roots = new ArrayList<>();

        for(Category c : categories){
            CategoryTreeDto node = categoryTreeDtoMap.get(c.getId());
            if(c.getParent() == null){
                roots.add(node);
            }else{
                CategoryTreeDto parentNode = categoryTreeDtoMap.get(c.getParent().getId());
                if(parentNode != null){
                    parentNode.getChildren().add(node);
                }
            }
        }

        sortTreeByName(roots);
        return roots;
    }

    private void sortTreeByName(List<CategoryTreeDto> categoryTreeDtos){
        categoryTreeDtos.sort(Comparator.comparing(CategoryTreeDto::getName, String.CASE_INSENSITIVE_ORDER));
        for(CategoryTreeDto categoryTreeDto : categoryTreeDtos){
            if(categoryTreeDto.getChildren() != null && !categoryTreeDto.getChildren().isEmpty()){
                sortTreeByName(categoryTreeDto.getChildren());
            }
        }
    }

}
