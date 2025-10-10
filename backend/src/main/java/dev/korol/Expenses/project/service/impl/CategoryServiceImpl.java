package dev.korol.Expenses.project.service.impl;

import dev.korol.Expenses.project.dto.categoryDTO.CategoryDTO;
import dev.korol.Expenses.project.dto.categoryDTO.CategoryTreeDto;
import dev.korol.Expenses.project.dto.categoryDTO.CreateCategoryRequest;
import dev.korol.Expenses.project.entity.Category;
import dev.korol.Expenses.project.entity.Kind;
import dev.korol.Expenses.project.entity.User;
import dev.korol.Expenses.project.exception.EntityNotFoundException;
import dev.korol.Expenses.project.repository.CategoryRepository;
import dev.korol.Expenses.project.repository.UserRepository;
import dev.korol.Expenses.project.service.CategoryService;
import dev.korol.Expenses.project.util.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.*;
import java.util.stream.Stream;

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
    private final UserRepository userRepository;


    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> listMerged(long userId, Kind kind){

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + userId + " not found "));

       List<Category> systemCategories =  categoryRepository.findAllBySystemIsTrueAndKind(kind);
       List<Category> userCategories = categoryRepository.findAllByUserIdAndKind(userId, kind);

       return Stream.concat(
               systemCategories.stream().map(categoryMapper::toCategoryDTO),
               userCategories.stream().map(categoryMapper::toCategoryDTO)
       ).sorted(Comparator.comparing(CategoryDTO::getName, String.CASE_INSENSITIVE_ORDER).reversed())
       .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryTreeDto> treeMerged(long userId, Kind kind) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + userId + " not found "));

        List<Category> sys  = categoryRepository.findAllBySystemIsTrueAndKind(kind);
        List<Category> mine = categoryRepository.findAllByUserIdAndKind(userId, kind);
        List<Category> all  = Stream.concat(sys.stream(), mine.stream()).toList();

        Map<Long, CategoryTreeDto> map = new HashMap<>();
        for(Category c : all){
            map.put(c.getId(), new CategoryTreeDto(c.getId(), c.getName(), c.getKind(), new ArrayList<>()));
        }
        List<CategoryTreeDto> roots = new ArrayList<>();

        for(Category c : all){
            CategoryTreeDto node = map.get(c.getId());
            if(c.getParent() == null){
                roots.add(node);
            }else{
                CategoryTreeDto parentNode = map.get(c.getParent().getId());
                if(parentNode != null){
                    parentNode.getChildren().add(node);
                }else{
                    roots.add(node);
                }
            }
        }
        sortTreeByName(roots);

        return roots;
    }

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

    @Override
    public CategoryDTO createUserCategory(long userId, CreateCategoryRequest createCategoryRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + userId + " not found "));
        long parentId = createCategoryRequest.getParentId();

        boolean checkParent = false;
        if(parentId != 0){
            checkParent = categoryRepository.findById(parentId)
                    .map(p -> p.isSystem() || (p.getUser() != null && p.getUser().getId() == userId))
                    .orElseThrow(() -> new IllegalArgumentException("Проблема з доступом до категорій, спробуй будь ласка пізніше"));
        }

        if(categoryRepository.existsByUserIdAndParentIdAndKindAndNameIgnoreCase(userId, parentId, createCategoryRequest.getKind(), createCategoryRequest.getName())){
            throw new IllegalArgumentException("Категорія вже існує у цій гілці");
        }

        Category category = categoryMapper.toCategory(createCategoryRequest);
        category.setUser(user);
        category.setSystem(false);
        if(checkParent)
            category.setParent(categoryRepository.findById(parentId)
                    .orElseThrow(() -> new EntityNotFoundException("Категорія не була знайдена")));

        return categoryMapper.toCategoryDTO(categoryRepository.save(category));
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
