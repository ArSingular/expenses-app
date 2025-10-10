package dev.korol.Expenses.project.controller;

import dev.korol.Expenses.project.dto.categoryDTO.CategoryDTO;
import dev.korol.Expenses.project.dto.categoryDTO.CategoryTreeDto;
import dev.korol.Expenses.project.dto.categoryDTO.CreateCategoryRequest;
import dev.korol.Expenses.project.dto.userDTO.UserResponse;
import dev.korol.Expenses.project.entity.Kind;
import dev.korol.Expenses.project.service.CategoryService;
import dev.korol.Expenses.project.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getCategories(@AuthenticationPrincipal UserDetails userDetails, @RequestParam Kind kind){
        String email = userDetails.getUsername();
        UserResponse user = userService.getUserByEmail(email);

        List<CategoryDTO> response = categoryService.listMerged(user.getUserId(), kind);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/tree")
    public ResponseEntity<List<CategoryTreeDto>> getCategoriesTree(@AuthenticationPrincipal UserDetails userDetails, @RequestParam Kind kind){
        String email = userDetails.getUsername();
        UserResponse user = userService.getUserByEmail(email);

        List<CategoryTreeDto> response = categoryService.treeMerged(user.getUserId(), kind);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@AuthenticationPrincipal UserDetails userDetails, @RequestBody CreateCategoryRequest createCategoryRequest){
        String email = userDetails.getUsername();
        UserResponse user = userService.getUserByEmail(email);

        CategoryDTO created = categoryService.createUserCategory(user.getUserId(), createCategoryRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

}
