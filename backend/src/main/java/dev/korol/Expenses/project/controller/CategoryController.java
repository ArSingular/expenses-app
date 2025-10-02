package dev.korol.Expenses.project.controller;

import dev.korol.Expenses.project.dto.categoryDTO.CategoryDTO;
import dev.korol.Expenses.project.dto.categoryDTO.CategoryTreeDto;
import dev.korol.Expenses.project.entity.Kind;
import dev.korol.Expenses.project.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Korol Artur
 * 01.10.2025
 */

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "http://localhost:4200")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getCategories(@RequestParam Kind kind){

        List<CategoryDTO> response = categoryService.listByKind(kind);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/tree")
    public ResponseEntity<List<CategoryTreeDto>> getCategoriesTree(@RequestParam Kind kind){

        List<CategoryTreeDto> response = categoryService.treeByKind(kind);

        return ResponseEntity.ok(response);
    }

}
